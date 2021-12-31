import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block, Text } from '@tarojs/components';
import './index.less'
type Props = {
  url: string,
}

interface NewImg{
  props: Props,
}

interface PageState {
  animationData: any,
  w: number,
  h: number,
}

class NewImg extends Component<{}, PageState> {
  constructor() {
    super(...arguments)
    this.state = {
      animationData: {},
      w: 0,
      h: 0,
    }
  }
  ImgOnload(e) {
    let animation = Taro.createAnimation({
      duration: 200,
      timingFunction: 'ease-in',
      delay: 0
    })
    animation.opacity(1).step()
    this.setState({
      w: e.detail.width,
      h: e.detail.height,
      animationData: animation.export()
    })
  }
  render() {
    const { url } = this.props
    const { animationData, w, h } = this.state
    return (
      <View className='img' style={`width: ${w}rpx;height: ${h}rpx`}>
        <Image mode="widthFix" src={url} style="opacity:0;height:auto" onLoad={this.ImgOnload} animation={animationData}></Image>
      </View>
    )
  }
}

export default NewImg