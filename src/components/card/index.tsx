import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block, Text } from '@tarojs/components';
import './index.less'
type Props = {
  info: any,
  index?: number,
  myclass?: string,
  onChoose: (e) => void,
}

interface Card{
  props: Props,
}

class Card extends Component {
  // static externalClasses = ['outer-class']
  render() {
    const { info, index, myclass } = this.props
    return (
      <View className={`card ${myclass}`} onClick={this.props.onChoose.bind(this,index)}>
        <View className="title">{info.rule_name}</View>
        <View className="type">{info.desc}</View>
        <View className="amount">￥<Text>{info.card_amount/100}</Text></View>
        {/* <View className="btn">开通/绑定</View> */}
      </View>
    )
  }
}

export default Card