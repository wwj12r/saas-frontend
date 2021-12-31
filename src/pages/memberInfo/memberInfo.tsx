import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components';
import './memberInfo.less'
import Report from '../../components/reportSubmit/index';
import { getCardInfo } from '../../api/index';
interface memberInfo{
  info: string
}

class MemberInfo extends Component<{},memberInfo> {
  config: Config = {
    navigationBarTitleText: '会员卡协议',
    navigationBarTextStyle: 'black',
    navigationBarBackgroundColor: '#f4f4f2'
  }
  constructor() {
    super(...arguments)
    this.state = {
      info: '',
    }
  }

  componentWillMount () { }

  async componentDidMount () { 
    console.log(this.$router.params)
    const {data} = await getCardInfo(this.$router.params.id,this.$router.params.type)
    console.log(data)
    this.setState({
      info: data.content
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { info } = this.state
    return (
      <Report>
        <View className='body'>
          <Text>{info}</Text>
        </View>
      </Report>
    )
  }
}
export default MemberInfo

