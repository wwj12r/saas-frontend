import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block, Text } from '@tarojs/components';
import './index.less'
type Props = {
  fromSet?: any,
  fromIndex?: boolean,
  fromCoupons?: any,
  fromPromo?: boolean,
  fromPromoLottery?: boolean,
  closeCollect?: () => void,
}

interface Collect{
  props: Props,
}

interface PageState {
  tipsShow: boolean,
  tipsAllShow: boolean,
}

let n;

class Collect extends Component<{}, PageState> {
  constructor() {
    super(...arguments)
    this.state = {
      tipsShow: false,
      tipsAllShow: false,
    }
  }

  componentDidMount () { 
    if ((new Date().getDate() !== Taro.getStorageSync('time') && this.props.fromIndex) || (this.props.fromSet && this.props.fromCoupons)) {
      this.setState({
        tipsAllShow: true
      })
      n = 5
      this.countDown()
    }
  }

  countDown() {
    !this.state.tipsShow && n --;
    if (n === 0) {
      this.setState({
        tipsAllShow: false
      })
      Taro.setStorageSync('time',new Date().getDate())
    } else {
      setTimeout(() => {
        this.countDown()
      }, 1000);
    }
  }

  showTips() {
    this.setState(pre => ({
      tipsShow: !pre.tipsShow
    }))
    this.props.fromPromo && this.props.closeCollect!()
  }

  render() {
    const {fromPromo, fromPromoLottery} = this.props
    const { tipsShow, tipsAllShow } = this.state
    const applogo = Taro.getStorageSync('app')
    return (
      <View className="collect">
        {
          tipsAllShow &&
          <View>
            {
              tipsShow ?
              <View className="collectTips" onClick={this.showTips}>
                <View className="collectBg">
                  <Image src={fromPromoLottery ? "https://img.xianxiapai.net/saas/collectTips2.png" : "https://img.xianxiapai.net/saas/collectTips.png"} className="img"></Image>
                  <Image className="applogo" src={applogo && applogo.split('|')[1]}></Image>
                  <View className="appname">{applogo && applogo.split('|')[0]}</View>
                  <View className="addBtn">马上去添加</View>
                </View>
              </View>
              :
              <View className="tips">
                <Text>添加到我的小程序，下次使用更方便</Text>
                <View className="btn" onClick={this.showTips}>添加</View>
              </View>
            }
          </View>
        }
        {
          fromPromo &&
          <View className="collectTips" onClick={this.showTips}>
            <View className="collectBg">
              <Image src={fromPromoLottery ? "https://img.xianxiapai.net/saas/collectTips2.png" : "https://img.xianxiapai.net/saas/collectTips.png"} className="img"></Image>
              <Image className="applogo" src={applogo && applogo.split('|')[1]}></Image>
              <View className="appname">{applogo && applogo.split('|')[0]}</View>
              <View className="addBtn">马上去添加</View>
            </View>
          </View>
        }
      </View>
    )
  }
}

export default Collect