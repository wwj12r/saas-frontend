import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block, Text } from '@tarojs/components';
import './index.less'
type Props = {
  url: string,
  type?: string
}

interface MovieImg{
  props: Props,
}

interface PageState {
  animationData: any,
}

class MovieImg extends Component<{}, PageState> {
  static externalClasses = ['outer-class']
  constructor() {
    super(...arguments)
    this.state = {
      animationData: {},
    }
  }
  ImgOnload() {
    let animation = Taro.createAnimation({
      duration: 200,
      timingFunction: 'ease-in',
      delay: 0
    })
    animation.opacity(1).step()
    this.setState({
      animationData: animation.export()
    })
  }
  render() {
    const { url, type } = this.props
    const { animationData } = this.state
    return (
      <View className={type? `${type} movieImg outer-class` : "movieImg outer-class"}>
        <Image mode="widthFix" src={url} style="opacity:0;height:auto" onLoad={this.ImgOnload} animation={animationData}></Image>
      </View>
    )
  }
}

export default MovieImg