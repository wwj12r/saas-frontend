import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, OpenData, Image } from '@tarojs/components';
import './tickets.less'
import MovieImg from '../../components/movieImg/index';
import { getTickets } from '../../api/index';
import { ticketData } from 'src/store/movies/interface';
import Report from '../../components/reportSubmit/index';
interface pageState {
  tickets: ticketData[],
}

export default class Tickets extends Component<{},pageState> {
  config: Config = {
    navigationBarTitleText: '电影票'
  }
  constructor() {
    super(...arguments)
    this.state = {
      tickets: [],
    }
  }

  componentWillMount () { }

  componentDidMount () { 
    this.getTicket()
  }

  async getTicket() {
    const {data,status} = await getTickets()
    if (status) {
      this.setState({
        tickets: data.tickets
      })
    }
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () {
    
  }

  render () {
    const {tickets} = this.state
    return (
      <Report>
        <View className='body'>
          {
            tickets.length > 0 ?
            tickets.map((item,index) => {
              return (
                <View className={`item ${item.ticketStatus&&'gray'}`} key={index} onClick={this.toOrderInfo.bind(this,item)}>
                  <View className="info">
                    <MovieImg url={item.imageUrl}></MovieImg>
                    <View className="detail">
                      <View className="title">
                        <View className="topic">{item.name}</View>
                        <View className="descr">{item.duration}分钟/{item.showVersion}</View>
                      </View>
                      <View className="desc">
                        <View className="num">{item.hallName} {item.countDesc}</View>
                        <View className="time">{item.showDateTime}</View>
                      </View>
                    </View>
                  </View>
                  {
                    item.ticketStatus === 0 ?
                    <View className="btn available flex">使用</View>
                    : item.ticketStatus === 1 ?
                    <View className="btn used flex">已使用</View>
                    :
                    <View className="btn timeout flex">已放映</View>
                  }
                </View>
              )
            })
            :
            <View className="noneStatus">这里空空如也</View>
          }
        </View>
      </Report>
    )
  }
  toOrderInfo(order) {
    Taro.navigateTo({
      url: `/pages/orderInfo/orderInfo?orderId=${order.orderId}&type=ticket`
    })
  }
}

