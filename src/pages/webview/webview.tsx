import Taro, { Component, Config } from '@tarojs/taro'
import { View, WebView } from '@tarojs/components';
import Api from '../../api/request';
import './webview.less'
import Report from '../../components/reportSubmit/index';
interface WebViewState {
  url: string,
}


class Admin extends Component<{},WebViewState> {
  config: Config = {
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#f4f4f2',
    navigationBarTextStyle: 'black',
  }
  constructor() {
    super(...arguments)
    this.state = {
      url: '',
    }
  }

  componentWillMount () { }

  async componentDidMount () { 
    console.log(this.$router.params)
    await Api.login()
    this.setState({
      url: this.$router.params.url
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { url } = this.state
    return (
      <Report>
        <View className="body2">
          {
            url&&
            <WebView src={url}></WebView>
          }
        </View>
      </Report>
    )
  }

  toOrders() {
    Taro.navigateTo({
      url: `/pages/orders/orders`
    })
  }
}
export default Admin

