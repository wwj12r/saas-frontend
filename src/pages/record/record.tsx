import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components';
import './record.less'
import Report from '../../components/reportSubmit/index';
import { goSomewhere } from '../../utils/common';
import NewImg from '../../components/newImg/index';
import { getLuckyList } from '../../api/index';
interface rpInfo{
  info: any[],
  has_more: boolean,
}

let page = 1

class Record extends Component<{},rpInfo> {
  config: Config = {
    navigationBarTitleText: '已兑换商品',
    navigationBarTextStyle: 'black',
    navigationBarBackgroundColor: '#fff'
  }
  constructor() {
    super()
    this.state = {
      info: [],
      has_more: true,
    }
  }

  componentWillMount () { }

  async componentDidMount () { 
    console.log(this.$router.params)
    this.getCoupons()
  }

  componentWillUnmount () { }

  componentDidShow () {}

  componentDidHide () { }

  onReachBottom() {
    if (!this.state.has_more) return
    page ++
    this.getCoupons()
  }

  async getCoupons() {
    const {data} = await getLuckyList(page)
    console.log(data)
    this.setState(pre=>({
      info: pre.info.concat(data.page),
      has_more: data.has_more
    }))
  }

  render () {
    const { info } = this.state
    return (
      <Report>
        <View className='body2'>
          <View className="tips flex">
            <Text className="flex">i</Text>
            <Text>所有奖品将自动发放至 <Text className="red">我的-优惠券</Text> 列表中</Text>
          </View>
          {
            info.length > 0 &&info.map((item,index) => {
              return (
                <View className="item" key={index}>
                  <View className="title">中奖时间：{item.created_at}</View>
                  <View className="movieBox">
                    <View className="info">
                      <View className="img flex">
                        <NewImg url={item.picurl}></NewImg>
                      </View>
                      <View className="movieInfo">
                        <View className="name">
                          <View>{item.name}</View>
                          {/* <View className="num">×1</View> */}
                        </View>
                        <View className="price">
                          <View className="money">有效期至{item.end_at && item.end_at.split(' ')[0]}</View>
                        </View>
                      </View>
                    </View>
                    <View className="btn flex" onClick={this.toWhere.bind(this,item)}>去查看</View>
                  </View>
                </View>
              )
            })
          }
        </View>
      </Report>
    )
  }
  toWhere(url) {
    Taro.navigateTo({
      url: '/pages/coupons/coupons'
    })
    goSomewhere(url)
  }
}
export default Record

