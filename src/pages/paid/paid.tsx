import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, OpenData, Image, Block } from '@tarojs/components';
import './paid.less'
import { getCoupons, getTradeDetail } from '../../api/index';
import Report from '../../components/reportSubmit/index';
import { goSomewhere } from '../../utils/common';
interface pageState {
  info: any,
}

export default class Coupons extends Component<{},pageState> {
  config: Config = {
    navigationBarTitleText: '支付成功'
  }
  constructor() {
    super(...arguments)
    this.state = {
      info: {},
    }
  }

  componentWillMount () { }

  componentDidMount () { 
    this.getTicket()
  }

  async getTicket() {
    const {data,status} = await getTradeDetail(this.$router.params.trade_id)
    console.log(data)
    if (status) {
      if (data.pay_status === 0) {
        setTimeout(() => {
          this.getTicket()
        }, 1000);
      } else if (data.pay_status === 10) {
        this.setState({
          info: data.extra_data
        })
      }
    }
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () {
    
  }

  render () {
    const { info } = this.state
    return (
      <Report>
        <View className='body'>
          <View className="top">
            <View className="title">购买成功</View>
            <View className="desc">套票已放入我的-优惠券列表</View>
            <View className="btnBox">
              <View className="btnl flex" onClick={this.toIndex}>返回首页</View>
              <View className="btnr flex" onClick={this.toCoupons}>查看套票</View>
            </View>
          </View>
          <View className="info" onClick={this.toWhere}>
            <Image src={info.imageUrl} mode="widthFix" className="img"></Image>
          </View>
        </View>
      </Report>
    )
  }

  toWhere() {
    goSomewhere(this.state.info)
  }

  toIndex() {
    Taro.reLaunch({
      url: '/pages/index/index'
    })
  }
  toCoupons() {
    Taro.redirectTo({
      url: '/pages/coupons/coupons'
    })
  }
}

