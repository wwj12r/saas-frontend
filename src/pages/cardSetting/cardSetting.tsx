import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, OpenData, Input, Block } from '@tarojs/components'
import './cardSetting.less'
import { connect } from '@tarojs/redux'
import { readMobile } from '../../actions/counter'
import SelectBox from '../../components/selectBox/index';
import { cardPreopen, cardBind, getUser } from '../../api/index';
import Report from '../../components/reportSubmit/index';
interface pageState {
  eyeOn: boolean,
  type: any,
  chooseMoneyIndex: number,
  money: number,
  mobile: string,
}

let pageType = {
  first: {
    id: 0,
    title: '设置会员卡支付密码',
    btn: '确定充值',
    barTitle: '充值会员卡'
  },
  change: {
    id: 1,
    title: '修改会员卡支付密码',
    btn: '确定修改',
    barTitle: '修改会员卡密码'
  },
  bind: {
    id: 2,
    title: '请输入卡号和密码',
    btn: '确定绑定',
    barTitle: '绑定会员卡'
  }
}

let password,cardId;
type PageDispatchProps = {
  readMobile: () => Promise<any>;
}
type PageOwnProps = {
  counter: any
}
type IProps = PageDispatchProps & PageOwnProps
interface CardSetting {
  props: IProps;
}

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  readMobile () {
    dispatch(readMobile())
  }
}))

class CardSetting extends Component<{},pageState> {
  config: Config = {
    navigationBarTitleText: ''
  }
  constructor() {
    super(...arguments)
    this.state = {
      mobile: '',
      money: 100,
      chooseMoneyIndex: 0,
      eyeOn: false,
      type: {}
    }
  }

  componentWillMount () { }

  async componentDidMount () { 
    console.log(this.$router.params)
    Taro.setNavigationBarTitle({
      title: pageType[this.$router.params.type].barTitle
    })
    const {data} = await getUser()
    this.setState({
      mobile: data.user.mobile,
      type: pageType[this.$router.params.type],
      money: Taro.getStorageSync('cardPrice')[0].price/100
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () {
    
  }

  toggleEye() {
    this.setState(pre => ({
      eyeOn: !pre.eyeOn
    }))
  }

  selectMoney(e) {
    this.setState({
      chooseMoneyIndex: e,
      money: Taro.getStorageSync('cardPrice')[e].price/100
    })
  }

  async submit() {
    if (!password || password.length < 6) {
      Taro.showToast({
        title: '密码位数不对',
        icon: 'none'
      })
      return
    } 
    if (this.$router.params.type === 'first') {
      this.firstOpen()
    } else if (this.$router.params.type === 'bind') {
      if (!cardId) {
        Taro.showToast({
          title: '请填写卡号'
        })
        return
      } 
      this.cardBind()
    }
  }

  async cardBind() {
    const {data,status} = await cardBind(cardId,password)
    if (status) {
      Taro.showToast({
        title: '绑定成功！'
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 2000);
    }
  }

  async firstOpen() {
    const {data,status} = await cardPreopen(this.$router.params.id,this.state.money,this.$router.params.card_rule_type,password)
    if (status) {
      console.log(data)
      Taro.requestPayment({
        'timeStamp': data.timeStamp,
        'signType': data.signType,
        'nonceStr': data.nonceStr,
        'paySign': data.paySign,
        'package': data.package
      }).then(res => {
        Taro.navigateBack()
      })
    }
  }

  getPassword(e) {
    password = e.detail.value
  }

  getCardId(e) {
    cardId = e.detail.value
  }

  render () {
    const { eyeOn, type, chooseMoneyIndex, money, mobile } = this.state
    return (
      <Report>
        <View className='body'>
          <View className="title">{type.title}</View>
          <View className="inputBox">
            {
              type.id === 0 ?
              <Block>
                <View className="input">
                  <View className="icon"></View>
                  <Input placeholder='手机号' type="number" maxLength={11} disabled value={mobile}></Input>
                </View>
                <View className="input">
                  <View className="icon cipher"></View>
                  <Input placeholder='设置6位数字密码' type="number" password={!eyeOn} maxLength={6} onInput={this.getPassword}></Input>
                  <View className={eyeOn?"eye":"eye off"} onClick={this.toggleEye}></View>
                </View>
              </Block>
              : type.id === 1 ?
              <Block>
                <View className="input">
                  <View className="icon"></View>
                  <Input placeholder='手机号' type="number" maxLength={11}></Input>
                </View>
                <View className="input">
                  <View className="icon code"></View>
                  <Input placeholder='输入验证码'></Input>
                  <View className="getCode flex" onClick={this.toggleEye}>获取验证码</View>
                </View>
                <View className="input">
                  <View className="icon cipher"></View>
                  <Input placeholder='设置6位数字密码' type="number" password={!eyeOn} maxLength={6}></Input>
                  <View className={eyeOn?"eye":"eye off"} onClick={this.toggleEye}></View>
                </View>
              </Block>
              : type.id === 2 ?
              <Block>
                <View className="input">
                  <View className="icon account"></View>
                  <Input placeholder='卡号' type="idcard" onInput={this.getCardId}></Input>
                </View>
                <View className="input">
                  <View className="icon cipher"></View>
                  <Input placeholder='密码' type="number" password={!eyeOn} onInput={this.getPassword} maxLength={6}></Input>
                  <View className={eyeOn?"eye":"eye off"} onClick={this.toggleEye}></View>
                </View>
              </Block>
              :
              <Block></Block>
            }
          </View>
          {
            type.id === 0 &&
            <Block>
              <View className="title">充值金额</View>
              <View className="sBox">
                <SelectBox chooseMoneyIndex={chooseMoneyIndex} onSelectMoney={this.selectMoney.bind(this)}></SelectBox>
              </View>
            </Block>
          }
          <View className={Taro.getSystemInfoSync().model.includes('iPhone X')?"btn flex ipx" : "btn flex"} onClick={this.submit}>{type.btn}</View>
          <View className="rules">
            <View className="menu">
              <Text className="topic">温馨提示： </Text>
            </View>
            <View className="rulesDesc">
              <View className="view">
                <View className="desc">如遇操作失败，请拨打客服<View className="text" onClick={() => {
                  Taro.makePhoneCall({
                    phoneNumber: '0571-88555889'
                  })
                }}>0571-88555889</View>，或<View className="text" onClick={() => {
                  Taro.makePhoneCall({
                    phoneNumber: '18670298941'
                  })
                }}>18670298941</View>联系客服人员</View>
              </View>
            </View>
          </View>
        </View>
      </Report>
    )
  }
}

export default CardSetting