import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { showLoading, hideLoading } from '../../utils/common';
import './authMobile.less'
import { postUserInfo, postUserMobile } from '../../api/index';
import Api from '../../api/request';
import Report from '../../components/reportSubmit/index';

let loginCode;

class Auth extends Component {
  config: Config = {
    navigationBarTitleText: '',
    disableScroll: true,
    navigationBarBackgroundColor: '#fff',
  }
  constructor() {
    super(...arguments)
    this.state = {
    }
  }

  componentWillMount () { }

  async componentDidMount () { 
    this.login()
  }

  login() {
    if (!Taro.getCurrentPages()[Taro.getCurrentPages().length-1].route.includes('auth')) return
    Taro.login().then(res => {
      loginCode = res.code
      console.log(loginCode)
      setTimeout(() => {
        this.login()
      }, 60*4*1000);
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  async getPhone(e:any) {
    showLoading()
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      const {iv,encryptedData} = e.detail
      const {status} = await postUserMobile(loginCode,iv,encryptedData)
      hideLoading()
      if (status) {
        // Taro.setStorageSync('unionToken', true)
        Taro.navigateTo({url:`/pages/auth/auth?toCoupons=${this.$router.params.toCoupons}`})
      } else {
        Taro.showToast({
          title:'授权失败，请重试',
          icon: 'none'
        })
      }
    }
    if (e.detail.errMsg.indexOf('fail') !== -1) {
      console.log('取消登录了')
      hideLoading()
      Taro.showModal({
        title: '温馨提示',
        showCancel: false,
        content: '购买电影票需要您的授权信息，请重新授权~'
      })
    }
  }

  render () {
    return (
      <Report>
        <View className='body2'>
          <View className="userInfo">
            <Image src={Taro.getStorageSync('app').split('|')[1]} mode={'widthFix'}></Image>
            {/* <View className="tips">仅用于展示你的头像跟昵称</View> */}
            <Button className="getInfo" type="primary" open-type="getPhoneNumber" onGetPhoneNumber={this.getPhone}>微信用户一键登录</Button>
            <View className="btn flex" onClick={this.back}>取消</View>
          </View>
        </View>
      </Report>
    )
  }
  back() {
    Taro.navigateBack()
  }
}
export default Auth

