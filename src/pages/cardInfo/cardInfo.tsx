import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, OpenData, Block } from '@tarojs/components'
import './cardInfo.less'
import Card from '../../components/card';
import Coupon from '../../components/coupon';
import { getCards, cardPreopen } from '../../api/index';
import SelectBox from '../../components/selectBox/index';
import Report from '../../components/reportSubmit/index';
import { track } from '../../utils/track';

interface indexState {
  cardIndex: number,
  cards: any,
  cardList: any,
  chooseMoneyIndex: number,
  money: number,
}

export default class CardInfo extends Component<{},indexState> {
  config: Config = {
    navigationBarTitleText: '会员卡',
    navigationBarTextStyle: 'white',
    navigationBarBackgroundColor: '#333',
  }
  constructor() {
    super(...arguments)
    this.state = {
      money: 100,
      chooseMoneyIndex: 0,
      cardIndex: 0,
      cards: {},
      cardList: [{
        has:{

        }
      }]
    }
  }

  componentWillMount () { }

  componentDidMount () { 
    // this.getCards()
    track('card_enter')
  }

  async getCards() {
    const {data,status} = await getCards()
    if (status) {
      this.setState({
        cards: data,
        cardList: Object.values(data) || [],
        money: Object.keys(data)[0] === 'deposit' ? data.deposit.self_price[0].price/100 : data.benefit.card_amount/100
      })
    }
  }

  componentWillUnmount () { }

  componentDidShow () { 
    this.getCards()
  }

  componentDidHide () {
    
  }

  chooseCard(e) {
    if (e === 2) return
    this.setState(pre =>({
      cardIndex: e,
      money: Object.keys(pre.cards)[e] === 'deposit' ? this.state.cardList[e].self_price[this.state.chooseMoneyIndex].price/100 : pre.cardList[e].card_amount/100
    }))
  }

  selectMoney(e) {
    this.setState({
      chooseMoneyIndex: e,
      money: this.state.cardList[this.state.cardIndex].self_price[e].price/100
    })
  }

  btnText(has,type) {
    if (!has) {
      return '立即开通'
    } else if (type === 'deposit') {
      return '立即充值'
    } else if (type === 'benefit') {
      return '立即续费'
    }
  }

  async preopen() {
    track('card_pay_start')
    if (Object.keys(this.state.cards)[this.state.cardIndex] === 'deposit' && !this.state.cardList[this.state.cardIndex].has.is_open) {
      this.toCard('first',this.state.cardList[this.state.cardIndex].id,Object.keys(this.state.cards)[this.state.cardIndex])
      return
    }
    const {data,status} = await cardPreopen(this.state.cardList[this.state.cardIndex].id,this.state.money,Object.keys(this.state.cards)[this.state.cardIndex])
    if (status) {
      console.log(data)
      track('card_pay_show')
      Taro.requestPayment({
        'timeStamp': data.timeStamp,
        'signType': data.signType,
        'nonceStr': data.nonceStr,
        'paySign': data.paySign,
        'package': data.package
      }).then(res => {
        track('card_pay_success')
        this.getCards()
      }, rej => {
        rej.errMsg.includes('cancel') ? track('card_pay_cancel') : track('card_pay_fail')
      })
    }
  }

  render () {
    const { cardIndex, cards, cardList, chooseMoneyIndex, money } = this.state
    return (
      <Report>
        {
          cards && Object.values(cards).length>0?
          <View className={`body ${Object.keys(cards)[cardIndex]}`}>
            {
              cardList[0]&&cardList[0].id&&
              <Block>
                <View className="cardList">
                  {
                    Object.keys(cards).length > 1 ? 
                    <Block>
                      <Card onChoose={this.chooseCard.bind(this)} info={cardList[0]} index={0} myclass={`${cardIndex === 0 ?'small':'little'} left ${Object.keys(cards)[0]}`}></Card>
                      <Card onChoose={this.chooseCard.bind(this)} info={cardList[1]} index={1} myclass={`${cardIndex === 1 ?'small':'little'} right ${Object.keys(cards)[1]}`}></Card>
                    </Block>
                    :
                    <Card onChoose={this.chooseCard.bind(this)} index={2} myclass={`normal ${Object.keys(cards)[0]}`} info={cardList[0]}></Card>
                  }
                </View>
                <View className="info">
                  {
                    Object.keys(cards)[cardIndex] === "deposit" ?
                    <Block>
                      {
                        cardList[cardIndex].has.is_open ?
                          <View className="storeInfo">
                            <View className="balance">
                              余额：<Text>¥{cardList[cardIndex].has.balance/100}</Text>
                            </View>
                            <View className="id">
                              <Text>会员卡号：{cardList[cardIndex].has.card_number}</Text>
                              {/* <View onClick={this.toCard.bind(this,'change')}>修改密码</View> */}
                            </View>
                            <View className="id">
                              <Text>有效期：{cardList[cardIndex].has.end_at&&cardList[cardIndex].has.end_at.split(' ')[0]}</Text>
                            </View>
                          </View>
                          :
                          <View className="formerVip" onClick={this.toCard.bind(this,'bind')}>老用户绑定></View>
                      }
                      <View className="select">
                        <View className="selectTitle">选择充值金额</View>
                        <SelectBox chooseMoneyIndex={chooseMoneyIndex} onSelectMoney={this.selectMoney.bind(this)} price={cardList[cardIndex].self_price}></SelectBox>
                      </View>
                    </Block>
                    :
                    cardList[cardIndex].has.is_open ?
                    <View className="vipInfo">
                      <View className="balance">
                        <Text>已开通</Text>
                      </View>
                      <View className="id">
                        <Text>有效期至：{cardList[cardIndex].has.end_at.split(' ')[0]}</Text>
                      </View>
                    </View>
                    :
                    <Block></Block>
                  }
                  <View className="topic">
                    <View className="gang">
                      <View className="point">
                        <View className="title flex">会员尊享权益</View>
                      </View>
                    </View>
                  </View>
                  {
                    cardList[cardIndex].promo_list.length > 0 &&
                    cardList[cardIndex].promo_list.map((item,index) => {
                      return (
                        <View className="prize" key={index}>
                          <View className="icon" style={`background-image:url(${item.icon})`}></View>
                          <View>
                            <View className="title">{item.title}</View>
                            <Text className="desc">{item.subtitle}</Text>
                          </View>
                        </View>
                      )
                    })
                  }
                  {
                    cardList[cardIndex].coupons.length>0&&
                    <View className="topic">
                      <View className="gang">
                        <View className="point">
                          <View className="title flex">开通即赠好礼</View>
                        </View>
                      </View>
                    </View>
                  }
                  {
                    cardList[cardIndex].coupons.length > 0 &&
                    cardList[cardIndex].coupons[cardList[cardIndex].coupons.length > 1 ? chooseMoneyIndex : 0].map((item,index) => {
                      return (
                        <Coupon info={item} key={index}></Coupon>
                      )
                    })
                  }
                </View>
                <View className="bottom">
                  <View className="total">
                    <Text>￥{money}</Text>
                    <View onClick={this.toMemberInfo}>支付即同意<Text>《会员卡协议》</Text></View>
                  </View>
                  {
                    cardList[cardIndex].has.is_open && Object.keys(cards)[cardIndex] === 'benefit'?
                    <View className="btn flex gray">已开通</View>
                    :
                    <View className="btn flex"
                    onClick={this.preopen}
                    >{this.btnText.bind(this,cardList[cardIndex].has.is_open,Object.keys(cards)[cardIndex])()}</View>
                  }
                </View>
              </Block>
            }
          </View>
          :
          <View className="noneStatus">
            暂无会员卡
          </View>
        }
      </Report>
    )
  }
  toMemberInfo() {
    Taro.navigateTo({
      url: `/pages/memberInfo/memberInfo?id=${this.state.cardList[this.state.cardIndex].id}&type=${Object.keys(this.state.cards)[this.state.cardIndex]}`
    })
  }
  toCard(type,id?,cardType?) {
    type === 'bind' && track('card_binding')
    Taro.navigateTo({
      url: `/pages/cardSetting/cardSetting?type=${type}&id=${id}&card_rule_type=${cardType}`
    })
  }
}

