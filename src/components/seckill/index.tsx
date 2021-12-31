import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, Block, ScrollView } from '@tarojs/components';
import './index.less'
import { secondToTime, toDouble } from '../../utils/common';
import { postPromoSeckillPay } from '../../api/index';
type Props = {
  info: any,
  refresh: () => void,
  taggleRules: () => void,
}

interface Seckill{
  props: Props,
}

interface PageState {
  chooseIndex: number,
  num: string,
  day: number,
}

class Seckill extends Component<{}, PageState> {
  constructor() {
    super(...arguments)
    this.state = {
      day: 0,
      num: '',
      chooseIndex: -1
    }
  }

  choose(index) {
    this.setState({
      chooseIndex: index
    })
  }

  componentDidMount() {
    this.putCDon()
  }

  putCDon() {
    if (!Taro.getCurrentPages()[Taro.getCurrentPages().length-1].route.includes('promo')) return
    if (this.props.info && this.props.info.product && this.props.info.product.length > 0) {
      let targetTime = this.props.info.product[this.state.chooseIndex > -1 ? this.state.chooseIndex : this.props.info.product.findIndex(i => i.status > -1)]
      if (!targetTime) return
      let nowTime = new Date().getTime()
      let cdTime = new Date(targetTime.riqi).getTime()
      let cd = Math.floor((targetTime.status === 0 ? new Date(new Date(new Date().getTime()+24*60*60*1000).setHours(0,0,0,0)).getTime() - nowTime : (cdTime - nowTime))/1000)%86400
      if (!cd) {
        this.props.refresh()
      }
      let day = Math.floor((cdTime - nowTime)/1000/86400)
      let res = cd > 0 ? secondToTime(cd,true) : ''
      this.setState({
        day: day,
        num: res
      })
    }
    setTimeout(() => {
      this.putCDon()
    }, 1000);
  }

  async kill() {
    const {data} = await postPromoSeckillPay()
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
    }, rej => {
      // rej.errMsg.includes('cancel') ? track('card_pay_cancel') : track('card_pay_fail')
    })
  }

  render() {
    const { info } = this.props
    const { chooseIndex, num, day } = this.state
    let theOne = chooseIndex
    if (info && info.product && info.product.length > 0) {
      theOne = chooseIndex > -1 ? chooseIndex : info.product.findIndex(i => i.status > -1)
    }
    return (
      <View className="top" style={`background:${info.material.background_color}`}>
        <Image src={info.material.background_img} className="image"></Image>
        <View className="rulesBtn flex" onClick={this.props.taggleRules}>活动规则</View>
        <View className="info">
          {
            info && info.product && info.product.length > 0 && 
            <Block>
              <ScrollView className="product" scrollX scrollIntoView={'theOne'}>
                {
                  info.product.map((item,index) => {
                    return (
                      <View className="outer" key='key'>
                        <View id={theOne - 1 === index ? 'theOne':''} className={`date flex ${theOne === index ? 'on':''}`} onClick={this.choose.bind(this,index)}>
                          <View className="riqi">{item.riqi.split(' ')[0]}</View>
                          <View className="time">{item.riqi.split(' ')[1]}</View>
                          <View className="status">{
                            item.status === -1 ? '已结束' : 
                            item.status === 0 ? 
                              item.stock ? '秒杀中' : '秒杀结束' : 
                            item.status === 1 ? '即将开始' : ''
                          }</View>
                        </View>
                      </View>
                    )
                  })
                }
              </ScrollView>
              <View className="cd">
                {
                  num && info.product[theOne].status > -1 &&
                  <Block>
                    {
                      info.product[theOne].status === 1 ? 
                      <Block>
                        {
                          day > 0 &&
                          <View className='desc'>距离开始
                          {
                            Object.values(day.toString()).map(item => {
                              return (
                                <Text className="num red" key="key">{item}</Text>
                              )
                            })
                          }
                          天</View>
                        }
                      </Block>
                      :
                      <View className='desc'>本场剩余</View>
                    }
                    {
                      Object.values(num).map(item => {
                        return (
                          <Block key="key">
                            <View className={item === ':' ? "num off" : "num"}>{item}</View>
                          </Block>
                        )
                      })
                    }
                  </Block>
                  }
              </View>
            </Block>
          }
          {
            info.product[theOne].coupons.map((item,index) => {
              return (
                <View className="ticket" key="key">
                  <View className="des">
                    <View className="name">{item.title}</View>
                    <View className="desc">
                      秒杀价:
                      <Text className="price">￥{info.product[theOne].price/100}</Text>
                      <Text className="mark">￥{item.mark_price/100}</Text>
                    </View>
                  </View>
                  <View className="count flex">仅剩{info.product[theOne].stock}份</View>
                </View>
              )
            })
          }
          {
            info.product[theOne].status === 0 && info.product[theOne].stock ?
              <View className="btn">
                <View className="btnTop flex" onClick={this.kill}>立即秒杀</View>
              </View>
              : info.product[theOne].status === 1 ?
              <View className="btn empty flex">即将开始</View>
              :
              <View className="btn gray">
                <View className="btnTop flex">已抢光 下周五再来吧</View>
              </View>
          }
        </View>
      </View>
    )
  }

  toSale() {
    Taro.switchTab({
      url: '/pages/sale/sale'
    })
  }

  toCoupon() {
    Taro.navigateTo({
      url: '/pages/coupons/coupons'
    })
  }
}

export default Seckill