import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, OpenData, Image } from '@tarojs/components';
import './snacks.less'
import { snackData } from '../../store/snack/interface';
import { getSnacks } from '../../api/index';
import SnackItem from '../../components/snackItem/index';
import Report from '../../components/reportSubmit/index';
interface pageState {
  snacks: snackData[],
}

export default class Snack extends Component<{},pageState> {
  config: Config = {
    navigationBarTitleText: '卖品票'
  }
  constructor() {
    super(...arguments)
    this.state = {
      snacks: [],
    }
  }

  componentWillMount () { }

  componentDidMount () { 
    this.getTicket()
  }

  async getTicket() {
    const {data,status} = await getSnacks()
    if (status) {
      this.setState({
        snacks: data.goodsOrders || []
      })
    }
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () {
    
  }

  render () {
    const {snacks} = this.state
    return (
      <Report>
        <View className='body'>
          {
            snacks.length>0?
            snacks.map((item,index) => {
              return (
                <SnackItem toIndex={this.toIndex} info={item} key={index}></SnackItem>
              )
            })
            :
            <View className="noneStatus">这里空空如也</View>
          }
        </View>
      </Report>
    )
  }
  toIndex(order) {
    if (order.status>1) return
    Taro.navigateTo({
      url: `/pages/orderInfo/orderInfo?orderId=${order.id}&type=snack`
    })
  }
}

