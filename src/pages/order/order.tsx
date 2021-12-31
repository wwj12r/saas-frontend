import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Button, Switch, Block, ScrollView, Input } from '@tarojs/components';
import { connect } from '@tarojs/redux'
import { readMobile } from '../../actions/counter'
import './order.less'
import Snack from '../../components/snack';
import OrderInfo from '../../components/orderInfo';
import ActionSheet from '../../components/actionSheet/index';
import { postGoodsBuy, postOrderPay, postGoodsPay, postOrderDetail, postGoodsDetail } from '../../api/index';
import Password from '../../components/password';
import { selectedPost, FilmsData, CinemaData, orderData, cardsData } from '../../store/movies/interface';
import { ScheduleData } from '../../store/seat/interface';
import { secondToTime } from '../../utils/common';
import Report from '../../components/reportSubmit/index';
import { track } from '../../utils/track';

type PageState = {
  film: FilmsData,
  cinema: CinemaData,
  schedule: ScheduleData,
  notice: string[],
  order: orderData,
  ticketChange: any,
  details: any[],
  goodsList: any[],
  costDetail: any,
  cards: any,
  password: string,
  typeList: any,
  goodsCoupons: any,
  ticketCoupons: any,
  passwordShow: string,
  countDownTime: number,
  showSnack: number,
  info: any,
}
type PageDispatchProps = {
  readMobile: () => Promise<any>;
}
type PageOwnProps = {
  counter: any
}
type IProps = PageDispatchProps & PageOwnProps
interface Order {
  props: IProps;
}

let selected:selectedPost = {};
let counting = false;

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  readMobile () {
    dispatch(readMobile())
  }
}))
class Order extends Component<{},PageState>{
  config: Config = {
    navigationBarTitleText: '确认订单'
  }
  constructor(){
    super(...arguments)
    this.state = {
      countDownTime: 900,
      passwordShow: '',
      password: '',
      ticketChange: {},
      details: [],
      costDetail: {},
      ticketCoupons: {},
      goodsCoupons: {},
      cards: {},
      goodsList:[],
      info: {},
      film: {},
      cinema: {},
      schedule: {},
      notice: [],
      order: {},
      typeList: false,
      showSnack: 3,
    }
  }

  componentWillMount () { }

  componentDidMount () { 
    selected = {}
    // console.log(date.data)
    track('order_enter')
    if (this.$router.params.type === 'ticket') {
      Taro.setStorageSync('lastPage', `orderId=${this.$router.params.orderId}`)
      this.getOrderInfo(JSON.parse(this.$router.params.orderId), true)
    }
  }

  componentWillUnmount () { }

  componentDidShow () { 
    if (this.$router.params.type === 'snack') {
      const goodlist = this.props.counter.snack
      this.getSnackInfo(goodlist)
    }
  }

  componentDidHide () {
    
  }
  
  async getOrderInfo(opt, fromOnload?:boolean) {
    opt.goodsCoupons && opt.goodsCoupons.hasOwnProperty('id') && (opt.goodsCoupons = [opt.goodsCoupons])
    opt.ticketCoupons && opt.ticketCoupons.hasOwnProperty('id') && (opt.ticketCoupons = [opt.ticketCoupons])
    fromOnload && this.$router.params.addCard === 'true' && (opt.want_benefit = true)
    const {data,status} = await postOrderDetail(opt)
    if (status) {
      console.log(data)
      this.setState({
        film: data.film,
        cinema: data.cinema,
        schedule: data.schedule,
        notice: data.notice,
        goodsList: data.goodsList,
        ticketChange: data.ticketChange,
        goodsCoupons: data.goodsCoupons,
        ticketCoupons: data.ticketCoupons,
        countDownTime: data.order.countdown,
        order: data.order,
        cards: data.cards,
        costDetail: data.costDetail
      },() => {
        !counting && this.countDown()
        if (data.cards&&data.cards.benefitCard) {
          data.cards.benefitCard.selected&& (selected = {...selected, 'benefitCard': data.cards.benefitCard})
          !data.cards.benefitCard.selected && selected.benefitCard && delete selected.benefitCard
        }
        if (data.cards&&data.cards.depositCard){
          data.cards.depositCard.selected&& (selected = {...selected, 'depositCard': data.cards.depositCard})
          !data.cards.depositCard.selected && selected.depositCard && delete selected.depositCard
        }
        data.goodsCoupons&&data.goodsCoupons.find(item => item.selected > 0) && (selected = {...selected,'goodsCoupons':data.goodsCoupons.find(item => item.selected > 0)})
        data.ticketCoupons&&data.ticketCoupons.find(item => item.selected > 0) && (selected = {...selected,'ticketCoupons':data.ticketCoupons.find(item => item.selected > 0)})
      })
    }
  }

  async getSnackInfo(opt,refresh?) {
    let func = refresh ? postGoodsDetail : postGoodsBuy
    const {data,status} = await func(opt)
    if (status&&data) {
      console.log(data)
      this.setState({
        info: data,
        order: data.order,
        notice: data.pickUpNotice,
        details: data.details,
        ticketChange: data.ticketChange,
        goodsCoupons: data.goodsCoupons||[],
        costDetail: data.costDetail
      })
    }
  }

  change(item:any,newCount:number,addOrNot:number) {
    newCount > 0 && track('order_sale_add')
    let newArray = this.state.goodsList
    const hasId = newArray.findIndex(items => items.id === item.id)
    newArray[hasId].count = newCount
    this.setState(pre => ({
      goodsList: newArray
    }),() => {
      this.postOrders('goods',this.state.goodsList)
    })
  }

  async postOrders(changeType,item,e?) {
    switch (changeType) {
      case 'depositCard':
        if (!item.selected) {
          if (selected.benefitCard) {
            selected.benefitCard.checked = 0
          }
          selected = {
            ...selected,
            'depositCard': (item.checked = 1) && item
          }
          if (item.operation === 'pay') {
            selected.goods && delete selected.goods
          }
        } else {
          delete selected.depositCard
        }
        // this.setState(pre => ({
        //   cards: pre.cards.depositCard.selected = e.detail.value && pre.cards
        // }))
      break
      case 'benefitCard':
        if (!item.selected) {
          if (selected.depositCard) {
            selected.depositCard.checked = 0
          }
          selected = {
            ...selected,
            'benefitCard': (item.checked = 1) && item
          }
          track('order_card_on')
        } else {
          delete selected.benefitCard
          track('order_card_off')
        }
        // this.setState(pre => ({
        //   cards: pre.cards.depositCard.selected = e.detail.value && pre.cards
        // }))
      break
      case 'goods':
        const goods = item.filter(item => item.count > 0)
        if (goods.length > 0) {
          selected = {
            ...selected,
            'goods': goods
          }
        } else {
          delete selected.goods
        }
        if (this.state.goodsCoupons.length>0 && this.state.goodsCoupons.some(i => i.selected === 1)) {
          selected = {...selected,'goodsCoupons': [this.state.goodsCoupons.find(i => i.selected === 1)]}
        } else {
          delete selected.goodsCoupons
        }
      break
      case 'coupons':
        if (item.to_type === 1) {
          selected = {...selected,'ticketCoupons': [(item.selected=1)&&item]}
          track('order_moviecoupon_use')
        } else if (item.to_type === 2) {
          selected = {...selected,'goodsCoupons': [(item.selected=1)&&item]}
          track('order_salecoupon_use')
        } else if (item === 'noUseTickets') {
          delete selected.ticketCoupons
          selected = {...selected,'ticketCoupons': 'noUse'}
        } else if (item === 'noUseGoods') {
          delete selected.goodsCoupons
          selected = {...selected,'goodsCoupons': 'noUse'}
        }
        this.toggleDetail()
      break
    }
    console.log(selected)
    // 优惠券联动
    if (changeType !== 'coupons') {
      const T = this.state.ticketCoupons
      const G = this.state.goodsCoupons
      if (T.length > 0 && T.findIndex(item=>item.selected>0)>-1) {
        selected = {...selected, 'ticketCoupons': T.find(item => item.selected > 0)}
      } else {
        delete selected.ticketCoupons
      }
      if (G.length > 0 && G.findIndex(item=>item.selected>0)>-1) {
        selected = {...selected, 'goodsCoupons': G.find(item => item.selected > 0)}
      } else {
        delete selected.goodsCoupons
      }
    }
    if (this.$router.params.orderId) {
      this.getOrderInfo(Object.assign(JSON.parse(this.$router.params.orderId),selected,{refresh:1}))
    } else {
      this.getSnackInfo(Object.assign(this.state.order,selected,{refresh:1}),true)
    }
  }

  toggleDetail() {
    this.setState(pre =>({
      typeList: !pre.typeList
    }))
  }
  hidePassword() {
    this.setState({
      passwordShow: ''
    })
  }
  showPassword() {
    this.setState({
      passwordShow: selected['depositCard'] ? selected['depositCard'].operation : 'pay'
    })
  }

  startPay() {
    if (this.$router.params.type === 'ticket') {
      this.payTicket()
    } else {
      this.payGoods()
    }
  }

  async payTicket() {
    track('order_pay_start')
    if (selected.hasOwnProperty('depositCard') && !this.state.password) {
      this.showPassword()
      return
    }
    let opt = Object.assign(JSON.parse(this.$router.params.orderId),selected)
    opt.goodsCoupons && opt.goodsCoupons.hasOwnProperty('id') && (opt.goodsCoupons = [opt.goodsCoupons])
    opt.ticketCoupons && opt.ticketCoupons.hasOwnProperty('id') && (opt.ticketCoupons = [opt.ticketCoupons])
    const {data,status} = await postOrderPay(opt)
    if (data.package) {
      track('order_pay_show')
      Taro.requestPayment({
        'timeStamp': data.timeStamp,
        'signType': data.signType,
        'nonceStr': data.nonceStr,
        'paySign': data.paySign,
        'package': data.package
      }).then(res => {
        track('order_pay_success')
        Taro.setStorageSync('lastPage', '')
        Taro.redirectTo({
          url: `/pages/orderInfo/orderInfo?orderId=${this.state.order.id}&type=ticket&from=order`
        })
      }, rej => {
        rej.errMsg.includes('cancel') ? track('order_pay_cancel') : track('order_pay_fail')
      })
    } else {
      Taro.setStorageSync('lastPage', '')
      Taro.redirectTo({
        url: `/pages/orderInfo/orderInfo?orderId=${this.state.order.id}&type=ticket&from=order`
      })
    }
  }

  async payGoods(password?:number|string) {
    if (this.state.info.deposit_pay_amount && !this.state.password) {
      this.showPassword()
      return
    }
    const {data,status} = await postGoodsPay(this.state.order,password)
    if (data.package) {
      console.log(data)
      Taro.requestPayment({
        'timeStamp': data.timeStamp,
        'signType': data.signType,
        'nonceStr': data.nonceStr,
        'paySign': data.paySign,
        'package': data.package
      }).then(res => {
        Taro.setStorageSync('lastPage', '')
        Taro.redirectTo({
          url: `/pages/orderInfo/orderInfo?orderId=${this.state.order.id}&type=snack`
        })
      })
    } else {
      Taro.setStorageSync('lastPage', '')
      Taro.redirectTo({
        url: `/pages/orderInfo/orderInfo?orderId=${this.state.order.id}&type=snack`
      })
    }
  }

  changeType(type) {
    if (type === this.state.typeList) {
      this.toggleDetail()
      return
    }
    const trackType = {
      'ticketCoupons' : 'moviecoupon_click',
      'salecoupon' : 'goodsCoupons_click',
      'costDetail' : 'detail',
      'ticketChange' : 'notice'
    }
    track(`order_${trackType[type] || `${type}_click`}`)
    this.setState({
      typeList: ''
    },() => {
      this.setState({
        typeList:type
      })
    })
  }

  inputChange(e) {
    this.setState({
      password:e.detail.value
    },() => {
      if (this.state.password.length === 6) {
        this.hidePassword()
        if (this.state.info.deposit_pay_amount) {
          this.payGoods(this.state.password)
        } else {
          selected.depositCard.password = this.state.password
          this.payTicket()
        }
        this.setState({
          password: ''
        })
      }
    })
  }
  countDown() {
    if (!Taro.getCurrentPages()[Taro.getCurrentPages().length-1].route.includes('order/order')) {
      counting = false
      return
    } else if (this.state.countDownTime === 0) {
      counting = false
      Taro.setStorageSync('refresh', true)
      Taro.setStorageSync('lastPage', '')
      Taro.navigateBack()
      return
    }
    counting = true
    this.setState(pre=>({
      countDownTime: pre.countDownTime - 1
    }),() => {
      setTimeout(() => {
        this.countDown()
      }, 1000);
    })
  }

  render () {
    const { typeList, film, cinema, schedule, notice, order, goodsCoupons, ticketCoupons, info,
      goodsList, cards, costDetail, ticketChange, details, password, passwordShow, countDownTime, showSnack } = this.state
    return (
      <Report>
        <View className='order'>
          {
            film.id > 0 &&
            <Block>
              <Image src="https://img.xianxiapai.net/saas/gouy.png" className="preload"></Image>
              <View className="counting flex">请在{secondToTime(countDownTime)}内完成支付</View>
              <OrderInfo cinema={cinema} schedule={schedule} film={film} info={order} otherClass="margin"></OrderInfo>
              <View className="movieMenu">
                <View className="menu">
                  <Text className="topic">优惠券</Text>
                  {
                    ticketCoupons.length > 0 ?
                    <Text className="desc" onClick={this.changeType.bind(this,'ticketCoupons')}>
                      {
                        ticketCoupons.length>0&&ticketCoupons.findIndex(item=>item.selected>0)>-1 ? 
                        <Text className="red">-{ticketCoupons.find(item=>item.selected>0).amount/100}元</Text>
                        :
                        <Text className="red">{`${ticketCoupons.length}张可用`}</Text>
                      }
                    </Text>
                    :
                    <Text className="desc" onClick={this.changeType.bind(this,false)}>暂无优惠券</Text>
                  }
                </View>
                <View className="menu">
                  <Text className="topic">影票小计</Text>
                  <View className="money">
                    {
                      (costDetail.depositCard || costDetail.benefitCard) &&
                      <Text className={`${costDetail.depositCard ? 'red' : ''} ka`}>卡</Text>
                    }
                    ￥{costDetail.ticket.amount/100}
                  </View>
                </View>
              </View>
              {
                cards.depositCard && 
                <View className="openVip">
                  <View className="left">
                    <View className="icon"></View>
                    <View className="info">
                      <View className="title">{cards.depositCard.title}</View>
                      <View className="desc">{cards.depositCard.subtitle}</View>
                    </View>
                  </View>
                  <View className="switch">
                    {
                      cards.depositCard.savePrice > 0 &&
                      <Text>本单立减<Text className="red">￥{cards.depositCard.savePrice/100}</Text></Text>
                    }
                    <View className={`gou ${cards.depositCard.selected ? 'on' : ''}`} onClick={this.postOrders.bind(this,'depositCard',cards.depositCard)}></View>
                  </View>
                </View>
              }
              {
                cards.benefitCard && 
                <View className="openVip">
                  <View className="left">
                    <View className="icon"></View>
                    <View className="info">
                      <View className="title">{cards.benefitCard.title}</View>
                      <View className="desc">{cards.benefitCard.subtitle}</View>
                    </View>
                  </View>
                  <View className="switch">
                    {
                      cards.benefitCard.savePrice > 0 &&
                      <Text>本单立减<Text className="red">￥{cards.benefitCard.savePrice/100}</Text></Text>
                    }
                    <View className={`gou ${cards.benefitCard.selected ? 'on' : ''}`} onClick={this.postOrders.bind(this,'benefitCard',cards.benefitCard)}></View>
                  </View>
                </View>
              }
            </Block>
          }
          {
            goodsList.length>0&&
            <View className="snack">
              <View className="menu">
                <Text className="topic">选购小食</Text>
                <Text className="extra">边吃边看最爽啦</Text>
              </View>
              {
                goodsList.length>0&&goodsList.map((item,index) => {
                  return (
                    index < showSnack &&
                    <Snack info={item} key={index} onChangeNum={this.change.bind(this)}></Snack>
                  )
                })
              }
              {
                showSnack < 99 &&
                <View className="checkMore flex" onClick={()=>{this.setState({showSnack: 1000})}}>
                  <Text className="flex">查看更多</Text>
                </View>
              }
              <View className="menu">
                <Text className="topic">小食代金券</Text>
                {
                  goodsCoupons.length > 0 ?
                  <Text className="desc" onClick={this.changeType.bind(this,'goodsCoupons')}>
                    {
                      goodsCoupons.length>0&&goodsCoupons.findIndex(item=>item.selected>0) > -1 ? 
                      <Text className="red">-{goodsCoupons.find(item=>item.selected>0).amount/100}元</Text>
                      :
                      <Text className="red">{`${goodsCoupons.length}张可用`}</Text>
                    }
                  </Text>
                  :
                  <Text className="desc" onClick={this.changeType.bind(this,false)}>暂无优惠券</Text>
                }
              </View>
              <View className="menu">
                <Text className="topic">小食小计</Text>
                <Text className="money">￥{costDetail.goods?costDetail.goods.amount/100:0}</Text>
              </View>
            </View>
          }
          {
            details.length>0&&
            <View className="snack">
              {
                details.length>0&&details.map((item,index) => {
                  return (
                    <Snack info={item} key={index} show={true}></Snack>
                  )
                })
              }
              <View className="menu">
                <Text className="topic">小食代金券</Text>
                {
                  goodsCoupons.length > 0 ?
                  <Text className="desc" onClick={this.changeType.bind(this,'goodsCoupons')}>
                    {
                      goodsCoupons.length>0&&goodsCoupons.findIndex(item=>item.selected>0) > -1 ? 
                      <Text className="red">-{goodsCoupons.find(item=>item.selected>0).amount/100}元</Text>
                      :
                      <Text className="red">{`${goodsCoupons.length}张可用`}</Text>
                    }
                  </Text>
                  :
                  <Text className="desc" onClick={this.changeType.bind(this,false)}>暂无优惠券</Text>
                }
              </View>
              <View className="menu">
                <Text className="topic">小食小计</Text>
                <Text className="money">￥{costDetail.goods?costDetail.goods.amount/100:0}</Text>
              </View>
              {
                info.deposit_pay_amount &&
                <View className="menu">
                  <Text className="topic">储值卡余额</Text>
                  <Text className="money">-￥{info.deposit_pay_amount/100}</Text>
                </View>
              }
            </View>
          }
          {
            notice.length > 0 &&
            <Block>
              {/* <View className="bindPhone">
                <View className="menu">
                  <Text className="topic">
                    <Text className="title">取票通知</Text>
                    <Text className="tips">取票码将通过微信消息发送</Text>
                  </Text>
                  <Text className="descS">{user.mobile}</Text>
                </View>
              </View> */}
              <View className="rules">
                <View className="menu">
                  <Text className="topic">{film.id?'购票':'领取'}须知</Text>
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
            </Block>
          }
          {
            passwordShow &&
            <Password passwordShow={passwordShow} password={password} togglePassword={this.hidePassword.bind(this)} inputChange={this.inputChange.bind(this)}></Password>
          }
          {
            typeList &&
            <ActionSheet 
              toggleDetail={this.toggleDetail.bind(this)} 
              ticketChange={ticketChange}
              costDetail={costDetail}
              goodsCoupons={goodsCoupons}
              ticketCoupons={ticketCoupons}
              chooseCoupon={this.postOrders.bind(this,'coupons')}
              type={typeList}
              ></ActionSheet>
          }
          <View className={Taro.getSystemInfoSync().model.includes('X')?'bottom ipx':'bottom'}>
            <View className="list">
              <View onClick={this.changeType.bind(this,'ticketChange')}>退改签须知</View>
              <View onClick={this.changeType.bind(this,'costDetail')}>应付<Text>￥{costDetail.amount/100 || 0}</Text></View>
            </View>
            <View className="btn flex" onClick={this.startPay}>立即付款</View>
          </View>
        </View>
      </Report>
    )
  }
}

export default Order