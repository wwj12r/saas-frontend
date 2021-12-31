import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block, Text, ScrollView, Input, Button, Swiper, SwiperItem } from '@tarojs/components';
import './index.less'
type Props = {
  info: any,
  isFull: boolean,
  films: any[],
  countingNum: string,  
  taggleRules: () => void,
  btnClick: () => void,
  refresh: () => void,
}

interface Group{
  props: Props,
}

interface PageState {
  rollingIndex: number,
  collectShow: boolean,
}

class Group extends Component<{}, PageState> {
  constructor() {
    super(...arguments)
    this.state = {
      collectShow: false,
      rollingIndex: 0,
    }
  }
  static defaultProps = {
    info: {
      material: {
        need_user_limit: 0
      }
    },
  };

  componentDidMount() {
    // this.counting(this.props.info.timeout_at)
  }

  changeIndex() {
    this.setState(pre => ({
      rollingIndex: pre.rollingIndex === this.props.info.success_list.length - 1 ? 0 : pre.rollingIndex + 1
    }))
  }

  render() {
    const { info, isFull, countingNum } = this.props
    const { rollingIndex } = this.state
    return (
      <View className="top" style={`background:${info.material.background_color}`}>
        {
          info.success_list[rollingIndex] && 
          <View className="rolling">
            <Swiper
              className="swiper"
              circular={true}
              interval={3000}
              autoplay={true}
              vertical={true}
              onChange={this.changeIndex}
            >
              <SwiperItem>
                <View className="rollingItem flex">{info.success_list[rollingIndex]}</View>
              </SwiperItem>
              <SwiperItem>
                <View className="rollingItem flex">{info.success_list[rollingIndex]}</View>
              </SwiperItem>
            </Swiper>
          </View>
        }
        <View className="rollingBlock"></View>
        {/* <Image src='https://img.xianxiapai.net/saas/promoBG2s.png' className="image"></Image> */}
        <Image src={info.material.background_img} className="image"></Image>
        <View className="rulesBtn flex" onClick={this.props.taggleRules}>活动规则</View>
        <View className="topInfo">
          {
            info.extra_data.coupons.length > 0 && info.extra_data.coupons.map((item,index) => {
              return (
                <View className="outer" key={index}>
                  <View className='cover'>
                    <View className="ticket item">
                      <View className="tips"></View>
                      <View className="info">
                        <View className="detail">
                          <View className="topic">{item.title}</View>
                          <Text className="descr">{item.subtitle}</Text>
                        </View>
                      </View>
                      <View className="ticketInfo">
                        <View className="limit flex">限量{info.material.coupon_limit}份</View>
                        <View className="cost"><Text>{item.amount/100}</Text>元</View>
                      </View>
                    </View>
                    <View className="topCir cir" style={'background:#BE38FF'}></View>
                    <View className="dotted"></View>
                    <View className="bottomCir cir" style={'background:#BE38FF'}></View>
                  </View>
                </View>
              )
            })
          }
          {
            info.join_list && info.join_list.length > 0 &&
            <View className="otherDesc">
              {
                Array(info.material.need_user_limit).fill('').map((item,index) => {
                  return (
                      <View className={index < info.join_list.length ? 'item':"item none"} key={index}>
                        {
                          index < info.join_list.length ?
                          <Block>
                            <Image src={info.join_list[index].avatar} className="avatar"></Image>
                            {
                              info.join_list[index].is_leader &&
                              <View className="leader">团长</View>
                            }
                          </Block>
                          :
                          <View className="que">?</View>
                        }
                      </View>
                  )
                })
              }
            </View>
          }
          <Text className="infoDesc">
            {
              info.my_together_id && !info.is_mine ?
              <Text>你已参与其他拼团</Text>
              : isFull && info.is_mine ?<Text>拼团成功，分享优惠给朋友吧！</Text>
              : isFull && !info.is_mine ? <Text>本团已满，请重新开团</Text>
              : info.join_list.length > 0 && info.timeout_at ? 
              <Text className="block">仅剩<Text className="yellow">{info.material.need_user_limit - info.join_list.length}</Text>个名额，{countingNum}后结束</Text> 
              : 
              <Text>分享到群，{info.material.need_user_limit}人即可成团</Text>
            }
          </Text>
          <View className="btn flex" onClick={this.props.btnClick}>
            {
              info.my_together_id && !info.is_mine ?
              '查看我的团'
              :info.status === 0 || (isFull && !info.is_mine) ?
              `${info.money/100}元立即开团`
              : isFull ?
              '分享活动给朋友'
              : !info.is_mine ?
              '一键参团'
              : 
              '邀请好友拼团'
            }
            {
              (info.is_mine || (isFull && info.is_mine)) &&
              <Button openType="share"></Button>
            }
          </View>
          {
            isFull ?
            <View className="checkCoupon" onClick={this.toCoupon}>查看我的兑换券</View>
            :
            <View className="rule">
              <View className="topic">拼团规则</View>
              <View className="info">
                <View className="flex">好友拼团</View>
                <View className="flex">人满成团</View>
                <View className="flex">人不满退款</View>
              </View>
            </View>
          }
        </View>
      </View>
    )
  }

  toCoupon() {
    Taro.navigateTo({
      url: `/pages/coupons/coupons`
    })
  }
}

export default Group