import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import configStore from './store'
import '@tarojs/async-await'
import './utils/ald-stat'
import Index from './pages/index'

import './app.less'

export const globalData = {
  sourceFrom: ''
}
const store = configStore()
// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/sale/sale',
      'pages/salePage/salePage',
      'pages/auth/auth',
      'pages/memberInfo/memberInfo',
      'pages/authMobile/authMobile',
      'pages/seat/seat',
      'pages/set/set',
      'pages/record/record',
      'pages/paid/paid',
      'pages/promo/promo',
      'pages/promos/promos',
      'pages/cardSetting/cardSetting',
      'pages/tickets/tickets',
      'pages/snacks/snacks',
      'pages/coupons/coupons',
      'pages/cardInfo/cardInfo',
      'pages/orderInfo/orderInfo',
      'pages/order/order',
      'pages/movies/movies',
      'pages/webview/webview',
      'pages/user/user'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      'color': '#4A4A4A',
      'selectedColor': '#FF5E51',
      'backgroundColor': '#FFFFFF',
      list: [{
        'pagePath': 'pages/index/index',
        'iconPath': 'images/index_movie.png',
        'selectedIconPath': 'images/index_movie1.png',
        'text': '电影'
      }, {
        'pagePath': 'pages/sale/sale',
        'iconPath': 'images/sale1.png',
        'selectedIconPath': 'images/sale.png',
        'text': '卖品'
      }, {
        'pagePath': 'pages/user/user',
        'iconPath': 'images/user1.png',
        'selectedIconPath': 'images/user.png',
        'text': '我的'
      }]
    },
    navigateToMiniProgramAppIdList: [
      'wxd8f3793ea3b935b8',//免押
      'wxd8a7d886dc3c37d5',//印鸽
      'wxf87a0744030eaf9c',//眼镜机
    ]
  }

  componentDidMount () {}

  componentDidShow () {
    const {query} = this.$router.params
    globalData.sourceFrom = query!['sourceFrom']
  }

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
