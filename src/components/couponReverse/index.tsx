import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block, Text, Button } from '@tarojs/components';
import './index.less'
import MovieImg from '../movieImg/index';
type Props = {
  info: any,
  bg: string,
  nextOne: boolean,
  index: number,
}

interface CouponReverse{
  props: Props,
}

const iconImage = [
  'https://img.xianxiapai.net/saas/unticket.png',
  'https://img.xianxiapai.net/saas/tickett.png',
  'https://img.xianxiapai.net/saas/unsnack.png',
  'https://img.xianxiapai.net/saas/snackk.png',
  'https://img.xianxiapai.net/saas/ungift.png',
  'https://img.xianxiapai.net/saas/giftt.png',
]

class CouponReverse extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { info, bg, nextOne, index } = this.props
    return (
      <View className={`cover ${info.coupons[0].to_type===1?'ticket':'snack'}`}>
        <View className={`${info.coupons[0].to_type===1?'ticket':'snack'} item ${info.is_done&&'used'} ${nextOne && 'nextOne'} ${info.is_timeout&&'timeout'} child${index}`}>
          <View className="ticketInfo">
            <View className="btn">
              <View className="cost">满<Text>{info.level_money/100}</Text>元</View>
              {
                nextOne &&
                <View className="desc">还差{info.gap_money/100}元</View>
              }
            </View>
          </View>
          {
            info &&
            <View className="info">
              <View className="detail">
                <View className="title">
                  <View className="topic">{info.coupons[0].title}</View>
                  <Text className="descr">{info.coupons[0].subtitle}</Text>
                </View>
              </View>
              {
                info.is_done || nextOne ?
                <MovieImg url={iconImage[info.coupons[0].to_type===3?5:info.coupons[0].to_type===1?1:3]} type={'coupon'}></MovieImg>
                :
                <MovieImg url={iconImage[info.coupons[0].to_type===3?4:info.coupons[0].to_type===1?0:2]} type={'coupon'}></MovieImg>
              }
            </View>
          }
          <View className="tips"></View>
        </View>
        <View className="topCir cir" style={`background: ${bg}`}></View>
        <View className="dotted"></View>
        <View className="bottomCir cir" style={`background: ${bg}`}></View>
      </View>
    )
  }
}

export default CouponReverse