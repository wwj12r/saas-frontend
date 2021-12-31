import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block, Text, Button } from '@tarojs/components';
import './index.less'
import MovieImg from '../movieImg/index';
type Props = {
  info: any,
  choose?: (e) => void,
  startShare?: (e) => void,
}

interface Coupon{
  props: Props,
}

const couponType = ['无门槛','满减券','兑换券']
const iconImage = [
  'https://img.xianxiapai.net/saas/ticketUsed.png',
  'https://img.xianxiapai.net/saas/ticketIcon.png',
  'https://img.xianxiapai.net/saas/snackUsed.png',
  'https://img.xianxiapai.net/saas/snackIcon.png',
  'https://img.xianxiapai.net/saas/giftUsed.png',
  'https://img.xianxiapai.net/saas/gift.png',
]

class Coupon extends Component {
  constructor(props) {
    super(props)
  }
  static defaultProps = {
    info: {
      end_at: ''
    },
  };
  static externalClasses = ['outer-class']

  chooseCoupon(info) {
    this.props.choose && this.props.choose(info)
  }

  toMiniApp(info) {
    Taro.navigateToMiniProgram({
      appId: info.extra_data.app_id,
      path: info.extra_data.page,
      extraData: info.extra_data.extra_data
    })
  }

  render() {
    const { info } = this.props
    return (
      <View className={`cover ${info.selected?'selected':''} ${info.to_type===1?'ticket':'snack'}`} onClick={this.chooseCoupon.bind(this,info)}>
        <View className={`${info.to_type===1?'ticket':'snack'} item ${info.is_use&&'used'} ${info.is_timeout&&'timeout'}`}>
          <View className="tips"></View>
          <View className="info">
            {
              (info.is_use || info.is_timeout) ?
              <MovieImg url={iconImage[(info.coupon_type===4||info.coupon_type===5)?4:info.to_type===1?0:2]} type={'coupon'}></MovieImg>
              :
              <MovieImg url={iconImage[(info.coupon_type===4||info.coupon_type===5)?5:info.to_type===1?1:3]} type={'coupon'}></MovieImg>
            }
            <View className="detail">
              <View className="title">
                <View className="topic">{info.title}</View>
                <Text className="descr">{info.subtitle}</Text>
              </View>
              {
                info.end_at&&
                <View className="desc">
                  <View className="num">有效期至{info.end_at.split(' ')[0]}</View>
                </View>
              }
            </View>
          </View>
          <View className="ticketInfo">
          {
            info.to_type===1&&info.coupon_type===3 || info.coupon_type===6?
            <View className="des">
              <View className="cost">2D/3D</View>
              <View className="desc">电影通用</View>
            </View>
            : info.to_type===2&&info.coupon_type===3?
            <View className="des">
              <View className="cost">卖品</View>
              <View className="desc">兑换券</View>
            </View>
            : info.coupon_type===4 && !info.extra_data.give_user_avatar ?
            <View className="flex">立即赠送
              <Button openType="share" onClick={this.props.startShare!} data-id={info.id}></Button>
            </View>
            : info.coupon_type===4 && info.extra_data.give_user_avatar ?
            <View className="given">
              <Image src={info.extra_data.give_user_avatar} className="avatar"></Image>
              <View className="status">已赠送</View>
            </View>
            : info.coupon_type===5 && info.extra_data.give_user_avatar ?
            <View className="gift">
              <Image src={info.extra_data.give_user_avatar} className="avatar"></Image>
              <View className="status">好友赠送</View>
            </View>
            :
            info.to_type===3 ?
            <View className="flex" onClick={this.toMiniApp.bind(this,info)}>去使用</View>
            :
            <View className="btn">
              <View className="cost">￥<Text>{info.amount/100}</Text></View>
              <View className="desc">{couponType[info.coupon_type-1]}</View>
            </View>
          }
          </View>
        </View>
        <View className="topCir cir"></View>
        <View className="dotted"></View>
        <View className="bottomCir cir"></View>
      </View>
    )
  }
}

export default Coupon