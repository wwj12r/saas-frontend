import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, OpenData, Input, Block } from '@tarojs/components'
import './card.less'
import { number } from 'prop-types';
import SelectBox from '../../components/selectBox/index';
import Report from '../../components/reportSubmit';
interface pageState {
  eyeOn: boolean,
  type: any,
  chooseMoneyIndex: number,
  money: number,
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

export default class CardSetting extends Component<{},pageState> {
  config: Config = {
    navigationBarTitleText: ''
  }
  constructor() {
    super(...arguments)
    this.state = {
      money: 100,
      chooseMoneyIndex: 0,
      eyeOn: false,
      type: {}
    }
  }

  componentWillMount () { }

  componentDidMount () { 
    Taro.setNavigationBarTitle({
      title: pageType[this.$router.params.type].barTitle
    })
    this.setState({
      type: pageType[this.$router.params.type]
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
      money: e*100+100
    })
  }

  render () {
    const { eyeOn, type, chooseMoneyIndex, money } = this.state
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
                  <Input placeholder='手机号' type="number" maxLength={11}></Input>
                </View>
                <View className="input">
                  <View className="icon cipher"></View>
                  <Input placeholder='设置6位数字密码' type="number" password={!eyeOn} maxLength={6}></Input>
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
                  <Input placeholder='卡号' type="number"></Input>
                </View>
                <View className="input">
                  <View className="icon cipher"></View>
                  <Input placeholder='密码' password={!eyeOn}></Input>
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
                <SelectBox chooseMoneyIndex={chooseMoneyIndex} onSelectMoney={this.selectMoney}></SelectBox>
              </View>
            </Block>
          }
          <View className={Taro.getSystemInfoSync().model.includes('iPhone X')?"btn flex ipx" : "btn flex"}>{type.btn}</View>
        </View>
      </Report>
    )
  }
}

