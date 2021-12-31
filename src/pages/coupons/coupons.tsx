import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, OpenData, Image, Block } from '@tarojs/components';
import './coupons.less'
import Coupon from '../../components/coupon';
import { getCoupons } from '../../api/index';
import { couponData } from 'src/store/movies/interface';
import Report from '../../components/reportSubmit/index';
import Collect from '../../components/collect/index';
import { track } from '../../utils/track';
interface pageState {
  coupons: couponData[],
  shareSuc: boolean,
}

export default class Coupons extends Component<{},pageState> {
  config: Config = {
    navigationBarTitleText: '优惠券'
  }
  constructor() {
    super(...arguments)
    this.state = {
      shareSuc: false,
      coupons: [],
    }
  }

  componentWillMount () { }

  componentDidMount () { 
    this.getTicket()
  }

  async getTicket() {
    const {data,status} = await getCoupons()
    if (status) {
      this.setState({
        coupons: data.list
      })
    }
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () {
    
  }

  public onShareAppMessage(res) {
    const id = res.target.dataset.id || ''
    return {
      title: `送你一张电影票，我们一起去${Taro.getStorageSync('cinema')}看电影吧！`,
      imageUrl: 'https://img.xianxiapai.net/saas/shareImg.jpeg',
      path: `/pages/index/index?give_coupon=${id}`,
    };
  }

  startShare() {
    setTimeout(() => {
      this.setState(pre =>({
        shareSuc: !pre.shareSuc
      }))
    }, this.state.shareSuc ? 0 : 1000);
  }

  render () {
    const {coupons, shareSuc} = this.state
    return (
      <Report>
        <View className='body'>
          {
            coupons.length>0 ? 
            <Block>
              {
                coupons.map((item,index) => {
                  return (
                    <Coupon key={index} info={item} startShare={this.startShare.bind(this)}></Coupon>
                  )
                })
              }
              <View className={Taro.getSystemInfoSync().model.includes('iPhone X')?"useBtn flex ipx":"useBtn flex"} onClick={this.toIndex}>去使用</View>
            </Block>
            :
            <View className="noneStatus">这里空空如也</View>
          }   
          {
            shareSuc && 
            <View className="shareSuc">
              <View className="bg" onClick={this.startShare}></View>
              <View className="modal">
                <Image src="https://img.xianxiapai.net/saas/shareSuc.png" className="icon"></Image>
                <View className="title">分享成功后</View>
                <View className="title">别忘了提醒亲友接受哦</View>
                <View className="btn flex" onClick={this.startShare}>朕知道了</View>
              </View>
            </View>
          }
          <Collect fromSet={this.$router.params.showTips} fromCoupons={true}></Collect>
        </View>
      </Report>
    )
  }
  toIndex() {
    track('coupon_gotouse')
    Taro.reLaunch({
      url: '/pages/index/index'
    })
  }
}

