import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block, Text, ScrollView, Input, Button, Swiper, SwiperItem, OpenData } from '@tarojs/components';
import './index.less'
import { postLuckyDraw, postScanStart, postScanResult } from '../../api/index';
import uploadFile from '../../utils/upload'
import Collect from '../collect/index';
import { track } from '../../utils/track';
type Props = {
  info: any,
  taggleRules: () => void,
}

interface Discern{
  props: Props,
}

interface PageState {
  resList: any[],
  uploadPic: string,
  resultInfo: any,
  collectShow: boolean,
  windowShow: number,
}

let goPath = ''

class Discern extends Component<{}, PageState> {
  constructor() {
    super(...arguments)
    this.state = {
      uploadPic: '',
      windowShow: 0,
      collectShow: false,
      resultInfo: {},
      resList: [],
    }
  }

  async componentDidMount() {
  }

  componentDidUpdate() {
  }

  pushList(n) {
    this.setState(pre =>({
      resList: pre.resList.concat(this.state.resultInfo.list[n])
    }), () => {
      if (this.state.resList.length === this.state.resultInfo.list.length) return
      setTimeout(() => {
        this.pushList(n + 1)
      }, 1000);
    })
  }

  async upload() {
    if (!this.props.info.is_login) {
      postLuckyDraw()
      return
    }
    track('promo_discern_clickupload')
    uploadFile(async (url) => {
      track('promo_discern_upload')
      const {data} = await postScanStart(url)
      console.log(data)
      this.checkResult(data.id)
    }, res => {
      this.setState({
        uploadPic: res.tempFiles[0].path
      })
    })
  }

  async checkResult(id) {
    const {data, status, message} = await postScanResult(id)
    if (status === 1) {
      if (data.status === 1) {
        track('promo_discern_getsuccess')
        goPath = data.go_path
        this.setState({
          resultInfo: data.data
        },() => {
          this.pushList(0)
        })
      } else if (data.status === 2) {
        track('promo_discern_getfail')
        Taro.showToast({title: message, icon: 'none'})
        this.setState({
          uploadPic: ''
        })
      } else  {
        setTimeout(() => {
          this.checkResult(id)
        }, 1000);
      }
    }
  }

  render() {
    const { info } = this.props
    const { resultInfo, collectShow, windowShow, uploadPic, resList } = this.state
    return (
      <View className="top" style={`background:${info.material.background_color}`}>
        <Image src={info.material.background_img} className="image"></Image>
        <View className="rulesBtn flex" onClick={this.props.taggleRules}>活动规则</View>
        <View className="promoTitle">{info.material.title}</View>
        <View className="promoDesc">{info.material.desc}</View>
        <View className="choosePic">
          {
            info.my_change_time > 0 ?
            <View className="uploadPic flex had" onClick={this.toLottery}>
              <View className="hadTitle">您已获得1次抽奖机会</View>
              <View className="btn flex">去抽奖</View>
            </View>
            : info.my_change_time === 0 ?
            <View className="uploadPic flex had" onClick={this.toLottery}>
              <View className="hadTitle">您已完成抽奖</View>
              <View className="btn flex">去查看</View>
            </View>
            :
            <Block>
            {
              uploadPic ?
              <View className="uploadPic flex">
                <View className="scan"></View>
                <Image src={uploadPic} mode="widthFix"></Image>
              </View>
              :
              <View className="uploadPic" onClick={this.upload}>
                <Image src="https://img.xianxiapai.net/saas/takeAPhoto.png" className="takeAPhoto"></Image>
                <View className="chooseDesc">点击上传当日电影票100%有奖</View>
              </View>
            }
            </Block>

          }
          <View className="topLeft border"></View>
          <View className="topRight border"></View>
          <View className="bottomLeft border"></View>
          <View className="bottomRight border"></View>
        </View>
        <View className="uploadEx" onClick={()=>{this.setState({windowShow:1})}}>上传图片范例</View>
        <View className="records">
          <View className="title">
            <Text className="topic">中奖纪录</Text>
            <Text className="btn" onClick={this.toRecord}>我的中奖纪录</Text>
          </View>
          {
            info.logs.length > 0 &&
            <View className="recordList">
              <Swiper
                className="swiper"
                circular={true}
                interval={2000}
                autoplay={true}
                vertical={true}
                displayMultipleItems={4}
              >
                {
                  info.logs.map((item,index) => {
                    return (
                      <SwiperItem key={index}>
                        <View className="record">
                          <Text>{item.name}</Text>
                          <Text>{item.desc}</Text>
                        </View>
                      </SwiperItem>
                    )
                  })
                }
              </Swiper>
              <View className="swiperBlock"></View>
            </View>
          }
        </View>
        {
          windowShow &&
          <View className="assistWindow">
            <View className="bg" onClick={()=>{this.setState({windowShow: 0})}}></View>
            <View className="modal">
              <View className="close" onClick={()=>{this.setState({windowShow: 0})}}></View>
              {
                windowShow === 1 ?
                <Block>
                  <View className="topic">图片范例</View>
                  <View className="desc">请上传清晰且完整的电影票照片</View>
                  <Image src="https://img.xianxiapai.net/saas/example.png" className="example"></Image>
                  <View className="btn flex" onClick={() => {this.setState({windowShow: 0})}}>知道了</View>
                </Block>
                :
                <Block></Block>
              }
            </View>
          </View>
        }
        {
          resultInfo.list.length > 0 &&
          <View className="resultWindow" onTouchMove={(e) => {e.stopPropagation()}}>
            <View className="title">扫描结果</View>
            <View className="animBox">
              {
                resList.length > 0 && resList.map((item,index) => {
                  return (
                    <View className={`resultBox ${!item.check && 'wrong'}`} key={index}>
                      <View className="info">
                        <Text className="key">{item.key}</Text>
                        <Text className="value">{item.value}</Text>
                      </View>
                      <View className="icon"></View>
                    </View>
                  )
                })
              }
              {
                resList.length === resultInfo.list.length && 
                <View className="pushDone">
                  <View className="wrongInfo">
                    {
                      resultInfo.extra_data &&
                      <View className="topic">- 买亏啦！你的电影票多花了{(Number(resultInfo.extra_data.sell_price.replace(/[^0-9]/ig,""))-Number(resultInfo.extra_data.card_price.replace(/[^0-9]/ig,"")))}元 -</View>
                    }
                    <View className="compare">
                      <View>
                        <View className="channel">渠道</View>
                        <View className="price">票价</View>
                        <View className="tips"></View>
                      </View>
                      <View>
                        <View className="channel">{resultInfo.extra_data.channel}</View>
                        <View className="price">{resultInfo.extra_data.sell_price}</View>
                        {
                          resultInfo.extra_data &&
                          <View className="tips high">贵￥{(Number(resultInfo.extra_data.sell_price.replace(/[^0-9]/ig,""))-Number(resultInfo.extra_data.card_price.replace(/[^0-9]/ig,"")))}元</View>
                        }
                      </View>
                      <View>
                        <View className="channel">影城原价</View>
                        <View className="price">{resultInfo.extra_data.market_price}</View>
                        <View className="tips"></View>
                      </View>
                      <View className="red">
                        <View className="channel">影城会员</View>
                        <View className="price">{resultInfo.extra_data.card_price}</View>
                        <View className="tips low flex">全网最低</View>
                      </View>
                    </View>
                  </View>
                  <View className="collect" onClick={() => {this.setState({collectShow: true})}}>收藏影城小程序，不再错过优惠</View>
                  <View className="chance">恭喜您获得 1 次抽奖机会</View>
                  <View className="btn flex" onClick={this.toWhere}>立即抽奖</View>
                </View>
              }
            </View>
          </View>
        }
        <Collect fromPromo={collectShow} closeCollect={() => {
          this.setState({
            collectShow: false
          })
        }}></Collect>
      </View>
    )
  }

  toLottery() {
    Taro.redirectTo({
      url: '/pages/promo/promo?type=lottery'
    })
  }

  toWhere() {
    track('promo_discern_gotodraw')
    Taro.redirectTo({
      url: goPath
    })
  }

  toRecord() {
    if (!this.props.info.is_login) {
      postLuckyDraw()
      return
    }
    Taro.navigateTo({
      url: `/pages/record/record`
    })
  }
}

export default Discern