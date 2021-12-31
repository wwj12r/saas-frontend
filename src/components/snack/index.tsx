import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block, Text } from '@tarojs/components';
import './index.less'
import { GoodsData } from '../../store/snack/interface';
import Cumulation from '../cumulation/index';
type Props = {
  info: GoodsData,
  show?: boolean,
  preview?: boolean,
  vertical?: boolean,
  sale?: boolean,
  onChangeNum?:(e,i,j) => void,
}

interface Snack{
  props: Props,
}

interface PageState {
  showImg: boolean,
  animationData: any,
}

class Snack extends Component<{}, PageState> {
  // static externalClasses = ['outer-class']
  constructor() {
    super(...arguments)
    this.state = {
      showImg: false,
      animationData: {},
    }
  }

  componentDidMount() {}

  // changeNum(e,i,j) {
  //   this.props.onChange(e,i,j)
  // }

  ImgOnload() {
    let animation = Taro.createAnimation({
      duration: 200,
      timingFunction: 'ease-in',
      delay: 0
    })
    animation.opacity(1).step()
    this.setState({
      showImg: true,
      animationData: animation.export()
    })
  }

  preview() {
    Taro.previewImage({
      urls: [this.props.info.imageUrl]
    })
  }

  render() {
    const { info, show, vertical, sale } = this.props
    const { showImg, animationData } = this.state
    return (
      <View className={`snackBox outer-class ${vertical && 'vertical'} ${sale && 'sale'}`}>
        <View className="detail">
          {
            vertical ? 
            <View className="imgBox">
              <Image src={info.imageUrl} style="opacity:0;height:auto" mode="widthFix" onLoad={this.ImgOnload} animation={animationData} onClick={this.preview}></Image>
            </View>
            :
            <Image className="img" src={info.imageUrl} style="opacity:0;height:auto" mode="widthFix" onLoad={this.ImgOnload} animation={animationData} onClick={this.preview}></Image>

          }
          <View className="desc">
            <View className="title">{info.goodsName}</View>
            <View className="description">{info.desc}</View>
            <View className="info">
              <View className="price">￥{info.standardPrice/100}
              {
                info.count && show &&
                <Text>x{info.count}</Text>
              }
              </View>
              {
                !show &&
                <Cumulation info={info} onChangeNum={this.props.onChangeNum!}></Cumulation>
              }
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default Snack