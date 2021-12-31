import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block, Text, ScrollView, Input } from '@tarojs/components';
import './index.less'
type Props = {
  password: string,
  passwordShow: string,
  inputChange: (e) => void,
  togglePassword: () => void,
}

interface Password{
  props: Props,
}

class Password extends Component {
  // static externalClasses = ['outer-class']
  render() {
    const { password, passwordShow } = this.props
    return (
      <View className="password" onTouchMove={(e) => {e.stopPropagation()}}>
        <View className="bg" onClick={this.props.togglePassword}></View>
        <View className="modal">
          <View className="close" onClick={this.props.togglePassword}></View>
          <View className="title">请{passwordShow === 'create' ? '设置' : '输入'}会员卡密码</View>
          <View className="input">
            <Input type='number' maxLength={6} onInput={this.props.inputChange} focus={true}></Input>
            <View className="numBox">
            {
              Array(6).map((item,index) => {
                return (
                  <View key={index} data-item={password.split('')[index]} className={password.length<=index?'empty':''}>·</View>
                )
              })
            }
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default Password