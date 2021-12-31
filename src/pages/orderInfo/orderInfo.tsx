import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Button, Block } from '@tarojs/components';
import './orderInfo.less'
import OrderInfo from '../../components/orderInfo';
import { FilmsData, CinemaData, orderData } from '../../store/movies/interface';
import { ScheduleData } from '../../store/seat/interface';
import { getOrderTicket, getGoodDetail } from '../../api/index';
import ActionSheet from '../../components/actionSheet/index';
import SnackItem from '../../components/snackItem/index';
import Report from '../../components/reportSubmit/index';
import { track } from '../../utils/track';


const list = {
  ticket: {
    name: '电影票',
    otherName: '小食',
    desc: '份观影小食',
    topic: '观影须知',
    count: '张'
  },
  snack: {
    name: '小食',
    otherName: '电影票',
    desc: '张电影票',
    topic: '领取小食须知',
    count: '份'
  }
}

interface pageState {
  // film: FilmsData,
  // cinema: CinemaData,
  // schedule: ScheduleData,
  // notice: string[],
  // order: orderData
  type: 'ticket'|'snack'| string,
  details: any[],
  detailList: boolean,
  film: any,
  cinema: any,
  schedule: any,
  notice: string[],
  ticketOrder: any,
  goodsOrder: any,
  showIcon: boolean,
}
export default class Success extends Component<{},pageState> {
  config: Config = {
    navigationBarTitleText: ''
  }
  constructor() {
    super(...arguments)
    this.state = {
      showIcon: false,
      type: '',
      details: [],
      detailList: false,
      film: {},
      cinema: {},
      schedule: {},
      notice: [],
      ticketOrder: {},
      goodsOrder: {}
    }
  }

  componentWillMount () { } 

  componentDidMount () {
    Taro.setNavigationBarTitle({
      title: `${list[this.$router.params.type].name}详情`
    })
    if (this.$router.params.type === 'ticket') {
      track('orderinfo_enter')
      if (this.$router.params.from === 'order') {
        track('orderinfo_afterpay')
        Taro.setStorageSync('refresh', true)
        this.setState({
          showIcon: true
        })
      }
      this.getTicketInfo()
    } else {
      this.getSnackInfo()
    }
  }

  async getTicketInfo() {
    const {data,status} = await getOrderTicket(this.$router.params.orderId)
    if (status) {
      this.setState({
        type: this.$router.params.type,
        film: data.film,
        cinema: data.cinema,
        schedule: data.schedule,
        notice: data.notice,
        ticketOrder: data.ticketOrder,
        goodsOrder: data.goodsOrder
      },() => {
        if (!data.ticketOrder.qrcode || (data.goodsOrder && data.goodsOrder.count && !data.goodsOrder.qrcode)){
          setTimeout(() => {
            this.getTicketInfo()
          }, 1000);
        }
      })
    }
  }

  async getSnackInfo() {
    const {data,status} = await getGoodDetail(this.$router.params.orderId)
    if (status) {
      console.log(data)
      this.setState({
        type: this.$router.params.type,
        details: data.details,
        ticketOrder: data.goodsOrder,
        goodsOrder: data.ticketOrder,
        notice: data.notice,
      },() => {
        if (!data.goodsOrder.qrcode || (data.ticketOrder && data.ticketOrder.count && !data.ticketOrder.qrcode)){
          setTimeout(() => {
            this.getSnackInfo()
          }, 1000);
        }
      })
    }
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () {
  }

  toggleDetail() {
    this.setState(pre =>({
      detailList: !pre.detailList
    }))
  }

  render () {
    const {film, cinema, schedule, notice, ticketOrder, detailList, goodsOrder, type, details, showIcon} = this.state
    return (
      <Report>
        <View className='success'>
          {
            showIcon&&
            <View className="showIcon">
              <View className="successTxt flex">购票成功</View>
              <View className="btn flex" onClick={this.toIndex}>{'< ' + ' 返回首页'}</View>
            </View>
          }
          {
            type === 'ticket' ?
            <OrderInfo cinema={cinema} schedule={schedule} film={film} info={ticketOrder} otherClass="whiteBg"></OrderInfo>
            :
            details.length>0&&details.map((item,index) => {
              return (
                <SnackItem info={item} key={index}></SnackItem>
              )
            })
          }
          <View className="qrcode">
            <View className="menu">
              <Text>取{list[type].name}</Text>
              {
                type === 'ticket'&&
                <Text className="money">取票后请至自助眼镜柜取用3D眼镜</Text>
              }
            </View>
            <View className={ticketOrder.status?"code gray":"code"}>
              {
                ticketOrder.status==4 &&
                <View className="blockl"></View>
              }
              <Image src={'data:image/png;base64,' + ticketOrder.qrcode}/>
              <View className="status flex">{['可使用','已使用','已过期','已放映','已退票'][ticketOrder.status]}</View>
              <Text><Text>{ticketOrder.count}</Text>{list[type].count}{list[type].name}</Text>
              <Text className={ticketOrder.status==4?'none':''}>取票码：{ticketOrder.pickUpCode || ticketOrder.printCode}</Text>
            </View>
          </View>
          {
            goodsOrder.count &&
            <View className="getSnack">
              <View className="menu">取{list[type].otherName}</View>
              <View className="menu">
                <Text className="topic">你有<Text>{goodsOrder.count}</Text>{list[type].desc}</Text>
                <Text className="desc" onClick={this.toggleDetail}>去领取</Text>
              </View>
            </View>
          }
          <View className="orderDetail">
            <View className="menu">订单详情</View>
            <View className="info">
              <View className="detail">
                <View>订单号：{ticketOrder.orderNo}</View>
                <View>购买时间：{ticketOrder.buyAt}</View>
                <View>总价：{ticketOrder.amount/100}元</View>
              </View>
              <View className="contact">
                <View className="customer">
                  <Button open-type="contact"></Button>
                </View>
                <View>联系客服
                  <Button className="button" open-type="contact"></Button>
                </View>
              </View>
            </View>
          </View>
          {
            notice.length>0 &&
            <View className="rules">
              <View className="menu">
                <Text className="topic">{list[type].topic}</Text>
              </View>
              <View className="rulesDesc">
                {
                  notice.map((item,index) => {
                    return (
                      <View key={index}>
                        <Text className="num">{index + 1}.</Text>
                        <Text className="desc">{item}</Text>
                      </View>
                    )
                  })
                }
              </View>
            </View>
          }
          {
            detailList &&
            <ActionSheet toggleDetail={this.toggleDetail.bind(this)} bottom="bottom" quickOrder={goodsOrder} title={`领取${list[type].otherName}`}></ActionSheet>
          }
        </View>
      </Report>
    )
  }
  toIndex() {
    Taro.reLaunch({
      url: '/pages/index/index'
    })
  }
}

