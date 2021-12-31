import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, OpenData, Image } from '@tarojs/components';
import './set.less'
import { postPromoPay, getPromoShow, getHome } from '../../api/index';
import Report from '../../components/reportSubmit/index';
interface pageState {
  info: any,
  notice: any[],
  films: any[]
}

export default class Snack extends Component<{},pageState> {
  config: Config = {
    navigationBarTitleText: '观影套票',
    navigationBarBackgroundColor: '#7c00cb',
    navigationBarTextStyle: 'white'
  }
  constructor() {
    super(...arguments)
    this.state = {
      films: [],
      info: [],
      notice: []
    }
  }

  componentWillMount () { }

  componentDidMount () { 
    this.getPromo()
    // this.getMovies()
  }

  async getPromo() {
    const {data,status} = await getPromoShow(this.$router.params.code)
    if (status) {
      console.log(data)
      Taro.setNavigationBarTitle({
        title: data.name
      })
      this.setState({
        info: data,
        notice: data.material.readme,
        films: [...data.films,{},{},{}]
      })
    }
  }

  // async getMovies() {
  //   const {data,status} = await getHome()
  //   if (status) {
  //     console.log(data)
  //     this.setState({
  //       films: [...data.films,{},{},{}],
  //     })
  //   }
  // }

  async pay() {
    if (this.state.info.has) return
    const {status,data} = await postPromoPay(this.$router.params.code)
    if (status) {
      console.log(data)
      Taro.requestPayment({
        'timeStamp': data.timeStamp,
        'signType': data.signType,
        'nonceStr': data.nonceStr,
        'paySign': data.paySign,
        'package': data.package
      }).then(res => {
        Taro.showToast({
          title: '购买成功！'
        })
        setTimeout(() => {
          Taro.redirectTo({
            url: `/pages/coupons/coupons`
          })
        }, 2000);
      })
    }
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () {
    
  }

  render () {
    const {info, notice, films} = this.state
    return (
      <Report>
        <View className='body'>
          <View className="top">
            <Image src="https://img.xianxiapai.net/saas/headimg3.png" mode={"widthFix"} className="image"></Image>
            <View className="deadline flex">活动截止时间：{info.end_at && info.end_at.split(' ')[0]}</View>
            <View className="ticketlist">
              {
                info.material.ticket_coupon_img &&
                <Image className="setticket" src={info.material.ticket_coupon_img}></Image>
              }
              {
                info.material.goods_coupon_img && 
                <Image className="setticket" src={info.material.goods_coupon_img}></Image>
              }
              {
                info.material.give_coupon_img && 
                <Image className="setticket" src='https://img.xianxiapai.net/saas/present.png'></Image>
              }
            </View>
            {
              info.has?
              <View className="btn flex gray" >已购买</View>
              :
              <View className="btn flex" onClick={this.pay}>{info.money/100}元购买
                <View className="tips flex">{info.material.price_text}</View>
              </View>
            }
            <View className="rules flex">
              <Text className="topic">使用说明</Text>
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
          </View>
          <View className="bottom">
            <View className="topic">
              <View className="gang">
                <View className="point">
                  <View className="title flex">热门电影推荐</View>
                </View>
              </View>
            </View>
            <View className="movieBox">
              {
                films.map((item,index) => {
                  return (
                    <View className={item.imageUrl?"movie":'movie empty'} key={index}>
                      <Image src={item.imageUrl} className="image"></Image>
                      <View className="name">{item.name}</View>
                      <View className="price">预计票价 <Text>￥{item.price/100}</Text></View>
                      <View className="btn flex" onClick={this.pay}>兑换券免费</View>
                    </View>
                  )
                })
              }
            </View>
          </View>
        </View>
      </Report>
    )
  }
}

