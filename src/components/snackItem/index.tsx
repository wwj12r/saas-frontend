import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block, Text } from '@tarojs/components';
import './index.less'
import MovieImg from '../movieImg/index';
type Props = {
  info: any,
  toIndex?: (e) => void,
}

interface SnackItem{
  props: Props,
}

class SnackItem extends Component {
  static externalClasses = ['outer-class']
  render() {
    const { info } = this.props
    return (
      <View className={`item ${info.status>1&&'gray'}`} onClick={this.props.toIndex!.bind(this,info)}>
        <View className="info">
          {
            info&&
            <MovieImg url={info.imageUrl} type={'snack'}></MovieImg>
          }
          <View className="detail">
            <View className="title">
              <View className="topic">{info.goodsName}</View>
              <View className="descr" style={`width:${info.status?'330':'470'}rpx`}>{info.desc}</View>
            </View>
            <View className="desc">
              <View className="num">共{info.count}份</View>
            </View>
          </View>
        </View>
        {
          info.status === 1 ?
          <View className="btn available flex">使用</View>
          : info.status === 2 ?
          <View className="btn used flex">已使用</View>
          : info.status === 3 ?
          <View className="btn timeout flex">已退款</View>
          :
          <Block></Block>
        }
      </View>
    )
  }
}

export default SnackItem