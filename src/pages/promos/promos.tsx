import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, OpenData, Image } from '@tarojs/components';
import './promos.less'
import { getPromoShows, postPromosPay } from '../../api/index';
import Report from '../../components/reportSubmit/index';
import MovieImg from '../../components/movieImg/index';
interface pageState {
  info: any,
  notice: any,
  films: any[],
  product: any[]
  productIndex: number,
  loaded: boolean,
}
const iconImage = [
  'https://img.xianxiapai.net/saas/ticketUsed.png',
  'https://img.xianxiapai.net/saas/promoTicket.png',
  'https://img.xianxiapai.net/saas/snackUsed.png',
  'https://img.xianxiapai.net/saas/promoSnack.png',
  'https://img.xianxiapai.net/saas/giftUsed.png',
  'https://img.xianxiapai.net/saas/promoGift.png',
]

export default class Snack extends Component<{},pageState> {
  config: Config = {
    navigationBarTitleText: '观影套票',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black'
  }
  constructor() {
    super(...arguments)
    this.state = {
      productIndex: 0,
      films: [],
      info: {},
      product: [],
      notice: [],
      loaded: false,
    }
  }

  componentWillMount () { }

  componentDidMount () { 
    this.getPromo()
  }

  async getPromo() {
    const {data,status} = await getPromoShows(this.$router.params.code)
    if (status) {
      console.log(data)
      Taro.setNavigationBarTitle({
        title: data.name
      })
      this.setState({
        loaded: true,
        info: data,
        notice: data.material.readme,
        product: data.product_list,
        films: [...data.films,{},{},{}]
      })
    }
  }

  async pay() {
    const {status,data} = await postPromosPay(this.state.product[this.state.productIndex].id)
    if (status) {
      console.log(data)
      Taro.requestPayment({
        'timeStamp': data.timeStamp,
        'signType': data.signType,
        'nonceStr': data.nonceStr,
        'paySign': data.paySign,
        'package': data.package
      }).then(res => {
        Taro.redirectTo({
          url: `/pages/paid/paid?trade_id=${data.trade_id}`
        })
      })
    }
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () {
    
  }

  render () {
    const {info, notice, films, productIndex, product, loaded} = this.state
    return (
      <Report>
        <View className={loaded? 'body loaded':'body'}>
          <View className="top" style={`background-image:url(${info.material.bg_image || ''});background-color:${info.material.bg_color || ''}`}>
            {/* <View className="deadline flex">活动截止时间：{info.end_at && info.end_at.split(' ')[0]}</View> */}
            {
              product.length > 0 &&
              <View className="box">
                <View className="titleBox">
                  {
                    product.map((item,index) => {
                      return (
                        <View className={productIndex === index ? "title flex on":"title flex"} key={index} onClick={() => {
                          this.setState({
                            productIndex: index
                          })
                        }}>
                          <Text>{item.name}</Text>
                        </View>
                      )
                    })
                  }
                  <View></View>
                </View>
                <View className="infoBox">
                  {
                    product[productIndex].coupons.length > 0 && product[productIndex].coupons.map((item,index) => {
                      return (
                        <View className={item.mark ? 'cover mark' : 'cover'} key={index}>
                          <View className='item'>
                            <View className="mark">{item.mark}</View>
                            <View className="info">
                              <MovieImg url={iconImage[item.to_type===3?5:item.to_type===1?1:3]} type={'coupon'}></MovieImg>
                              <View className="detail">
                                <View className="title">
                                  <View className="topic">{item.title}</View>
                                  <Text className="descr">{item.subtitle}</Text>
                                </View>
                                {
                                  item.end_at&&
                                  <View className="desc">
                                    <View className="num">有效期至{item.end_at.split(' ')[0]}</View>
                                  </View>
                                }
                              </View>
                            </View>
                          <View className="ticketInfo flex">
                            <View className="limit">价值：</View>
                            <View className="cost">￥<Text>{item.amount/100}</Text></View>
                          </View>
                          </View>
                          <View className="topCir cir"></View>
                          <View className="dotted"></View>
                          <View className="bottomCir cir"></View>
                        </View>
                      )
                    })
                  }
                  <View className="price_text">{product[productIndex].promo_text}</View>
                </View>
              </View>
            }
            {
              <View className="btnBG flex">
                {
                  product[productIndex].has?
                  <View className="btn flex gray" >已购买</View>
                  :
                  <View className="btn flex" onClick={this.pay}>
                    <Text>{product[productIndex].price/100}元购买
                      {
                        product[productIndex].price_desc &&
                        <Text className="tip flex">{product[productIndex].price_desc}</Text>
                      }
                    </Text>
                  </View>
                }
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
                      {/* <View className="price">预计票价 <Text>￥{item.price/100}</Text></View> */}
                      {/* <View className="btn flex" onClick={this.pay}>兑换券免费</View> */}
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

