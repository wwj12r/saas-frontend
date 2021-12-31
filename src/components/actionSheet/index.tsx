import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block, Text, ScrollView, Button } from '@tarojs/components';
import './index.less'
import Coupon from '../coupon';
type Props = {
  bottom?: string,
  quickOrder?: any,
  title?: string,
  ticketChange?: any,
  costDetail?: any,
  ticketCoupons?: any,
  goodsCoupons?: any,
  type?: any,
  toggleDetail: () => void,
  chooseCoupon?: (e) => void,
}

interface ActionSheet{
  props: Props,
}

class ActionSheet extends Component {
  // static externalClasses = ['outer-class']
  render() {
    const { bottom, quickOrder, title, ticketChange, type, costDetail, goodsCoupons, ticketCoupons } = this.props
    const typeList = {
      ticketChange: {
        title: '退改签须知',
      },
      costDetail: {
        title: '结算明细'
      },
      ticketCoupons: {
        title: '优惠券列表'
      },
      goodsCoupons: {
        title: '优惠券列表'
      },
    }
    return (
      <View className="selectBox" onTouchMove={(e) => {e.stopPropagation()}}>
        <View className="bg" onClick={this.props.toggleDetail}></View>
        <View className={Taro.getSystemInfoSync().model.includes('X')?`detail ipx ${bottom || ''}`:`detail ${bottom || ''}`}>
          <View className="title flex">{title || typeList[type].title || '优惠券列表'}</View>
          <ScrollView className="list" scrollY>
            {
              quickOrder &&
              <View className="qrcode">
                <View className="code">
                  <Image src={'data:image/png;base64,' + quickOrder.qrcode}/>
                  <Text>数量：{quickOrder.count}</Text>
                  <Text>订单号：{quickOrder.pickUpCode || quickOrder.printCode}</Text>
                </View>
              </View>
            }
            {
              type === 'ticketChange' &&
              <Block>
                <View className='ticketChange'>
                  <View className="desc">
                    <View className="tag"><Text>{ticketChange.body.change.tag}</Text></View>
                    <View className="topic">{ticketChange.body.change.title}</View>
                  </View>
                  <View className="notice">{ticketChange.body.change.notice}</View>
                </View>
                <View className='ticketChange'>
                  <View className="desc">
                    <View className="tag"><Text>{ticketChange.body.mcard.tag}</Text></View>
                    <View className="topic">{ticketChange.body.mcard.title}</View>
                  </View>
                  <View className="notice">{ticketChange.body.mcard.notice}</View>
                </View>
                <View className='ticketChange'>
                  <View className="desc">
                    <View className="tag"><Text>{ticketChange.body.refund.tag}</Text></View>
                    <View className="topic">{ticketChange.body.refund.title}</View>
                  </View>
                  <View className="notice">{ticketChange.body.refund.notice}</View>
                </View>
              </Block>
            }
            {
              type === 'costDetail' &&
              <Block>
                {
                  costDetail.cards.length>0&&
                  costDetail.cards.map((item,index) => {
                    return (
                      <View className="ticketDetail" key={index}>
                        <View className="topic">{item.title}</View>
                        <View className="info">
                          <View className="name">{item.subtitle}</View>
                          <View className="desc">{item.amount/100}元</View>
                        </View>
                      </View>
                    )
                  })
                }
                {
                  costDetail.goods.list.length>0&&
                  <View className="ticketDetail">
                    <View className="topic">{costDetail.goods.title}</View>
                    {
                      costDetail.goods.list.map((item,index) => {
                        return (
                          <View className="info" key={index}>
                            <View className="name">{item.name}</View>
                            <View className="desc">{item.price/100}元x{item.count}</View>
                          </View>
                        )
                      })
                    }
                  </View>
                }
                {
                  costDetail&&costDetail.ticket&&
                  <View className="ticketDetail">
                    <View className="topic">{costDetail.ticket.title}
                      {
                        costDetail.ticket.subtitle &&
                        <Text className="subtitle">（{costDetail.ticket.subtitle}）</Text>
                      }
                    </View>
                    {
                      costDetail.ticket.list.length>0&&
                      costDetail.ticket.list.map((item,index) => {
                        return (
                          <View className={(item.tags.length>0&&item.tags.some(e => e!='standard'))?'info red':'info'} key={index}>
                            <View className="name">{item.name}</View>
                            <View className="desc">
                              {
                                item.tags.length>0&&
                                item.tags.map((ite,inde) => {
                                  return (
                                    <Text className={ite} key={index}>卡</Text>
                                  )
                                })
                              }
                              {item.price/100}元x{item.count}
                            </View>
                          </View>
                        )
                      })
                    }
                  </View>
                }
                {
                  costDetail.depositCard&&
                  <View className="ticketDetail">
                    <View className="topic">{costDetail.depositCard.title}</View>
                    <View className="info">
                      <View className="name">{costDetail.depositCard.subtitle}</View>
                      <View className="desc">{costDetail.depositCard.amount/100}元</View>
                    </View>
                  </View>
                }
                {
                  costDetail.benefitCard&&
                  <View className="ticketDetail">
                    <View className="topic">{costDetail.benefitCard.title}</View>
                    <View className="info">
                      <View className="name">{costDetail.benefitCard.subtitle}</View>
                      <View className="desc">{costDetail.benefitCard.amount/100}元</View>
                    </View>
                  </View>
                }
              </Block>
            }
            {
              type === 'ticketCoupons' &&
              <Block>
                {
                  ticketCoupons.map((item,index) => {
                    return (
                      <Coupon info={item} key={index} choose={this.props.chooseCoupon}></Coupon>
                    )
                  })
                }
                <Button type='default' className="nouse flex" onClick={this.props.chooseCoupon!.bind(this,'noUseTickets')}>不使用优惠券</Button>
              </Block>
            }
            {
              type === 'goodsCoupons' &&
              <Block>
                {
                  goodsCoupons.map((item,index) => {
                    return (
                      <Coupon info={item} key={index} choose={this.props.chooseCoupon}></Coupon>
                    )
                  })
                }
                <Button type='default' className="nouse flex" onClick={this.props.chooseCoupon!.bind(this,'noUseGoods')}>不使用优惠券</Button>
              </Block>
            }
              {/* <View className='ticketDetail'>
                <View className="topic">电影票</View>
                <View className="detailList">
                  <Text>优惠后价格</Text>
                  <Text>35.9元x2</Text>
                </View>
              </View> */}
          </ScrollView>
          <View className="close" onClick={this.props.toggleDetail}>收回</View>
        </View>
      </View>
    )
  }
}

export default ActionSheet