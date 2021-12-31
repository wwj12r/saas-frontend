import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components';
import './index.less'
import CouponReverse from '../couponReverse/index';
type Props = {
  info: any,
  draws: any[],
}

interface Accumulate{
  props: Props,
}

interface PageState {
}

class Accumulate extends Component<{}, PageState> {
  constructor() {
    super(...arguments)
    this.state = {}
  }

  render() {
    const { info, draws } = this.props
    const unDoneLevelId = draws ? draws.findIndex(i => !i.is_done) : 0
    return (
      <View className="top" style={`background:${info.material.background_color}`}>
        <Image src={info.material.background_img} className="image"></Image>
        <View className="process">
          <View className="topic">你已消费{info.my_total_money/100 || 0}元，再买{draws[unDoneLevelId].gap_money/100 || draws[0].level_money/100}元可得下一奖励</View>
          <View className="line">
          {
            draws && draws.length > 0 && draws.map((item,index) => {
              return (
                <View className={`level ${item.is_done ? 'done' : unDoneLevelId === index ? 'next':''}`} key={index}>
                  <View className="card"></View>
                  <View className="red"></View>
                  <View className="middle"></View>
                  <View className="price">{item.level_money/100}</View>
                </View>
              )
            })
          }
          </View>
        </View>
        <View className="btn flex" onClick={this.toSale}>购买小食</View>
        <View className="toCoupon" onClick={this.toCoupon}>查看奖励</View>
        {
          draws && draws.length > 0 && draws.map((item,index) => {
            return (
              <CouponReverse info={item} key={index} bg={info.material.background_color} nextOne={unDoneLevelId===index} index={index}></CouponReverse>
            )
          })
        }
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

export default Accumulate