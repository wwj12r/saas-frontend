import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, OpenData, Block, Image, Button } from '@tarojs/components';
import './user.less'
import { connect } from '@tarojs/redux'
import { save } from '../../actions/counter'
import Api from '../../api/request';
import { getUser } from '../../api/index';
import { userData } from 'src/store/interface';
import { bannerData } from '../../store/interface';
import Report from '../../components/reportSubmit/index';
import { goSomewhere } from '../../utils/common';
import { track } from '../../utils/track';
interface pageState {
  userInfo: userData;
  banner: bannerData[];
  showImg: boolean;
}
type PageDispatchProps = {
  save: (e) => Promise<any>;
}
type PageOwnProps = {
  counter: any
}
type IProps = PageDispatchProps & PageOwnProps
interface User {
  props: IProps;
}

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  save (e) {
    dispatch(save(e))
  }
}))

class User extends Component<{},pageState> {
  config: Config = {
    navigationBarTitleText: '我的'
  }
  constructor(props) {
    super(props)
    this.state = {
      showImg: false,
      banner:[],
      userInfo: {
        id: 0,
        name: '',
        cinemaId: 0,
        loginAt: 0,
        avatar: '',
        mobile: '',
        admin: 0,
      }
    }
  }

  componentWillMount () { }

  async componentDidMount () { 
    await Api.login()
    track('user_enter')
    this.initUser()
  }

  async initUser() {
    const {data,status} = await getUser()
    if (status) {
      this.props.save(data.user.mobile)
      this.setState({
        userInfo: data.user,
        banner: data.banner
      })
    }
  }

  componentWillUnmount () { }

  componentDidShow () { 
    if (Taro.getStorageSync('lastPage') === 'auth') {
      this.initUser()
      Taro.setStorageSync('lastPage', '')
    }
  }

  componentDidHide () {}

  scan() {
    Taro.scanCode({
      onlyFromCamera: true
    }).then(async (res) => {
      const {msg,status} = await Api.request(res.result)
      Taro.showModal({
        title: '',
        content: msg,
        showCancel: false
      })
    })
  }

  render () {
    const {userInfo, banner, showImg} = this.state
    return (
      <Report>
        <View className='body'>
          <View className="info">
            <View>
              <View className="avatar">
                {
                  userInfo.avatar ?
                  <OpenData type='userAvatarUrl'/>
                  :
                  <View className="cover" onClick={this.userTo.bind(this,'')}></View>
                }
              </View>
              {
                userInfo.avatar ?
                <View className="desc">
                  <OpenData type='userNickName' className="name"/>
                  <View className="phone">{userInfo.mobile}</View>
                </View>
                :
                <View className="desc" onClick={this.userTo.bind(this,'')}>点击登录</View>
              }
            </View>
            {
              userInfo.admin &&
              <View className="reload" onClick={this.scan}>核验扫码</View>
            }
          </View>
          <Image className="banner" mode="widthFix" src={banner[0]!.image} hidden={!showImg} onLoad={() => {
            this.setState({
              showImg: true,
            })}} onClick={this.toWhere.bind(this,banner[0])}></Image>
            {/* })}} onClick={()=>{Taro.navigateTo({
              url: `/pages/cardSetting/cardSetting?type=first&id=1`
            })}}></Image> */}
          <View className="list">
            <View className="menu normal vip" onClick={this.userTo.bind(this,'cardInfo')}>
              <Text className="topic">会员卡</Text>
            </View>
            <View className="menu normal ticket" onClick={this.userTo.bind(this,'tickets')}>
              <Text className="topic">电影票</Text>
            </View>
            <View className="menu normal snack" onClick={this.userTo.bind(this,'snacks')}>
              <Text className="topic">卖品票</Text>
            </View>
            <View className="menu normal coupon" onClick={this.userTo.bind(this,'coupons')}>
              <Text className="topic">优惠券</Text>
            </View>
          </View>
          <View className="chat">
            <View className="menu normal chat" onClick={() => {track('user_help')}}>
              <Text className="topic">联系客服</Text>
              <Button className="button" open-type="contact"></Button>
            </View>
          </View>
        </View>
      </Report>
    )
  }

  toWhere(page) {
    track(`user_banner_${page.id}`)
    goSomewhere(page)
  }

  userTo(url?:string) {
    const trackType = {
      'cardInfo' : 'card',
      'tickets' : 'movie_ticket',
      'snacks' : 'sale_ticket',
      'coupons' : 'coupon',
    }
    url && track(`user_${trackType[url] || url}`)
    if (!this.state.userInfo.avatar || !url) {
      Taro.navigateTo({
        url: `/pages/authMobile/authMobile`
      })
    } else {
      Taro.navigateTo({
        url: `/pages/${url}/${url}`
      })
    }
  }
}

export default User