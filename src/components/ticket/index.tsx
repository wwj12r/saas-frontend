import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block, Text, Button } from '@tarojs/components';
import './index.less'
type Props = {
  info: any,
  cardPriceInfo?: any,
  index: number,
  prices: any,
  card?: any,
  useBenefitCard?: boolean,
  orderSeat: (e) => void,
}

interface Ticket{
  props: Props,
}
class Ticket extends Component {

  render() {
    const { info, cardPriceInfo, index, prices, useBenefitCard, card } = this.props
    return (
      <View className={`outer ${index<0 ? 'card': ''}`}>
        <View className="cover">
          <View className="item flex">
            <View className="seatName">{info.name}</View>
            {
              (cardPriceInfo&&cardPriceInfo.buyLimit && cardPriceInfo.buyLimit > 0 &&index < cardPriceInfo.buyLimit) ?
              <View className="price">
                {
                  cardPriceInfo.type != 'standard' &&
                  <Text className={'text '+cardPriceInfo.type}>卡</Text>
                }
                <Text className="priceNum">￥{cardPriceInfo.prices.find(price => price.areaId === info.areaId)!.price/100}</Text>
              </View>
              : useBenefitCard && card && card.benefit.buyLimit > 0 && index < card.benefit.buyLimit ?
              <View className="price">
                <Text className={'text benefit'}>卡</Text>
                <Text className="priceNum">￥{prices.find(price => price.areaId === info.areaId)!.benefit_sell_price/100}</Text>
              </View>
              :
              index < 0 ?
              <View className="price">
                <Text className="priceNum">￥{prices}</Text>
              </View>
              :
              index >= 0 && prices &&
              <View className="price">
                <Text className="priceNum">￥{prices.find(price => price.areaId === info.areaId)!.price/100}</Text>
              </View>
            }
          </View>
          <View className="leftCir cir"></View>
          <View className="rightCir cir"></View>
        </View>
        <View className="close" onClick={this.props.orderSeat.bind(this,info)}></View>
      </View>
    )
  }
}

export default Ticket