import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block, Text, ScrollView, Input, Button } from '@tarojs/components';
import './index.less'
type Props = {
  info: any,
  isFull: boolean,
  taggleRules: () => void,
  btnClick: () => void,
}

interface Assist{
  props: Props,
}

class Assist extends Component {
  render() {
    const { info, isFull } = this.props
    return (
      <View className="top" style={'background:#fffef0'}>
        <Image src={info.material.background_img} className="image"></Image>
        {/* <Image src='https://img.xianxiapai.net/saas/promoBG1s.jpg' className="image"></Image> */}
        <View className="rulesBtn flex" onClick={this.props.taggleRules}>活动规则</View>
        <View className="topInfo">
          {
            info.material.prize.length > 0 && info.material.prize.map((item,index) => {
              return (
                <View className="outer" key={index}>
                  <View className='cover'>
                    <View className="ticket item">
                      <View className="tips"></View>
                      <View className="info">
                        <View className="detail">
                          <View className="topic">{item.title}</View>
                          <Text className="descr">{item.subtitle}</Text>
                        </View>
                      </View>
                      <View className="ticketInfo">
                        <View className="limit flex">限量{item.limit}份</View>
                        <View className="cost"><Text>{item.price_text}</Text>元</View>
                      </View>
                    </View>
                    <View className="topCir cir" style={'background:#FFB123'}></View>
                    <View className="dotted"></View>
                    <View className="bottomCir cir" style={'background:#FFB123'}></View>
                  </View>
                </View>
              )
            })
          }
          {
            info.is_running && !info.is_mine &&
            <View className="otherDesc">
              <Image src={info.share_user.avatar} className="avatar"></Image>
              <Text className="talk flex">{info.is_assist ? '感谢你的助力，现在你\n也可以分享免费得啦～' : '我想要免费领爆米花，\n帮我助力你也能得哦～'}</Text>
            </View>
          }
          <Text className="infoDesc">
            {
              info.is_running && info.is_mine && !isFull &&
              <Text className="block">你还差<Text className="red">{info.material.need_user_limit - info.assist_list.length}</Text>位好友助力</Text>
            }
            {
              !info.is_running ?
              '分享到群，3位好友助力即可免费领取'
              : info.is_mine && isFull ? '恭喜你获得免费爆米花兑换券' : '3位好友助力，即可获得免费爆米花'
            }
          </Text>
          <View className="btn flex" onClick={this.props.btnClick}>
            {
              !info.is_running ?
              <Text>立即分享</Text>
              : info.is_mine ? 
                isFull ? <Text>立即查看</Text> : <Text>继续分享</Text>
              : isFull || info.is_assist ? <Text>分享得免费爆米花</Text> : <Text>给TA助力</Text>
            }
            {
              (info.is_running && !info.is_mine && !info.is_assist) || (info.is_running && info.is_mine && isFull) || !info.is_login?
              <Block></Block>
              :
              <Button openType="share"></Button>
            }
          </View>
          {
            info.is_running &&
            <View className="list">
              <View className="title"># 好友助力榜 #</View>
              {
                info.assist_list.map((item,index) => {
                  return (
                    <View className="friend" key={index}>
                      <View className="info">
                        <Image src={item.avatar} className={index>info.assist_list.length-1 ? "avatar none":"avatar"}></Image>
                        <View className="name">{item.name}</View>
                      </View>
                      <View className="desc">{index>info.assist_list.length-1?'':'助力成功'}</View>
                    </View>
                  )
                })
              }
            </View>
          }
        </View>
      </View>
    )
  }
}

export default Assist