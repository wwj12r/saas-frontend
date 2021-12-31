import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block, Text } from '@tarojs/components';
import './index.less'
type Props = {
  price?: any[],
  chooseMoneyIndex: any,
  onSelectMoney: (e) => void,
}

interface SelectBox{
  props: Props,
}

class SelectBox extends Component {
  componentDidMount() {
    console.log(this.props.price)
    this.props.price && Taro.setStorageSync('cardPrice',this.props.price)
  }
  static externalClasses = ['outer-class']
  render() {
    const { chooseMoneyIndex, price } = this.props
    const realPrice = price||Taro.getStorageSync('cardPrice')
    return (
      <View className="selectBox">
        {
          realPrice.map((item,index) => {
            return (
              <View className={chooseMoneyIndex===index?'on':''} onClick={this.props.onSelectMoney.bind(this,index)} key={index}>
                {
                  item.desc &&
                  <View className="desc">{item.desc}</View>
                }
                {realPrice[index].price/100}元
              </View>
            )
          })
        }
      </View>
    )
  }
}

export default SelectBox