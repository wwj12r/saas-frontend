import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components';
import './index.less'
type Props = {
  info: any,
  onChangeNum:(e,i,j) => void,
}

interface Cumulation{
  props: Props,
}

class Cumulation extends Component {

  changeNum(addOrNot:number,info:any) {
    if (this.props.info.count === 0 && addOrNot < 0) return
    if (this.props.info.count === info.buyLimit && addOrNot > 0) return
    this.props.onChangeNum(info,this.props.info.count+addOrNot,addOrNot)
  }
  render() {
    const { info } = this.props
    return (
      <View className="num">
        <View className={info.count > 0 ? "minus" : "minus none"} onClick={this.changeNum.bind(this, -1, info)}></View>
        <View className={info.count > 0 ? "count" : "count none"}>{info.count}</View>
        <View className="plus" onClick={this.changeNum.bind(this, 1, info)}></View>
      </View>
    )
  }
}

export default Cumulation