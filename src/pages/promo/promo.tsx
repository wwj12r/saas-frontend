import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, OpenData, Image, Button, Block } from '@tarojs/components';
import './promo.less'
import { getPromoScan, getPromoShow, getHome, postAssist, postPayGroup, getPromoGroup, getLuckyShow, getCumulativeGoods, getPromoSeckill } from '../../api/index';
import Report from '../../components/reportSubmit/index';
import Group from '../../components/group/index';
import Assist from '../../components/assist/index';
import Collect from '../../components/collect/index';
import Api from '../../api/request';
import { secondToTime } from '../../utils/common';
import Lottery from '../../components/lottery/index';
import Discern from '../../components/discern/index';
import { track } from '../../utils/track';
import Accumulate from '../../components/accumulate/index';
import Seckill from '../../components/seckill/index';
interface pageState {
  info: any,
  notice: any[],
  films: any[],
  is_login: number,
  isFull: boolean,
  countingNum: string,
  rulesShow: boolean,
  assistShow: boolean,
  collectShow: boolean,
  infoData: any[],
}

let cting = false;

export default class Snack extends Component<{},pageState> {
  config: Config = {
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#fff',
    enablePullDownRefresh: true,
    navigationBarTextStyle: 'black'
  }

  onPullDownRefresh() {
    this.init()
    Taro.stopPullDownRefresh()
  }
  constructor() {
    super(...arguments)
    this.state = {
      countingNum: '00:00:00',
      collectShow: false,
      is_login: 0,
      isFull: false,
      assistShow: false,
      rulesShow: false,
      films: [],
      infoData: [],
      info: {
        material: {
          need_user_limit: 0,
        }
      },
      notice: []
    }
  }

  componentWillMount () { }

  async componentDidMount () { 
    await Api.login()
    console.log(this.$router.params)
    track(`promo_${this.$router.params.type}_enter`)
    cting = false
    this.init()
  }

  init() {
    this.$router.params.type === 'assist' && this.getPromo()
    this.$router.params.type === 'together' && this.getPromoGroup()
    this.$router.params.type === 'lottery' && this.getPromoLottery()
    this.$router.params.type === 'discern' && this.getPromoDiscern()
    this.$router.params.type === 'accumulate' && this.getPromoAcc()
    this.$router.params.type === 'seckill' && this.getPromoSec()
  }
  
  async getPromoSec() {
    const {data} = await getPromoSeckill()
    console.log(data)
    this.setState({
      info: data,
      notice: data.material.readme,
    })
    Taro.setNavigationBarTitle({
      title: data.name
    })  
  }

  async getPromoAcc() {
    const {data} = await getCumulativeGoods()
    // const data = {"id":11,"cinema_id":46,"name":"卖品累计消费送福利","code":"cumulative_goods","material":{"readme":[""],"background_img":"https://img.xianxiapai.net/saas/accBg.png","background_color":" #FD4A2B"},"start_at":"2019-11-01 00:00:00","end_at":"2019-12-01 11:00:00","share_title":"一起拼团看电影吧","share_img":"https://img.xianxiapai.net/longxia/image/20190912/48821568965389_.pic_hd.jpg","level":[{"level_name":"满29元","level_money":2900,"coupons":{"id":9,"title":"影票兑换券","coupon_type":3,"to_type":2,"amount":3500,"subtitle":"无门槛兑换电影票1张"},"is_done":1,"gap_money":3400},{"level_name":"满39元","level_money":3900,"coupons":{"id":9,"title":"影票兑换券","coupon_type":3,"to_type":1,"amount":3500,"subtitle":"无门槛兑换电影票1张"},"is_done":1,"gap_money":3400},{"level_name":"满59元","level_money":5900,"coupons":{"id":9,"title":"影票兑换券","coupon_type":3,"to_type":1,"amount":3500,"subtitle":"无门槛兑换电影票1张"},"is_done":1,"gap_money":3400},{"level_name":"满89元","level_money":8900,"coupons":{"id":9,"title":"影票兑换券","coupon_type":3,"to_type":1,"amount":3500,"subtitle":"无门槛兑换电影票1张"},"is_done":1,"gap_money":3400},{"level_name":"满129元","level_money":12900,"coupons":{"id":9,"title":"影票兑换券","coupon_type":3,"to_type":1,"amount":3500,"subtitle":"无门槛兑换电影票1张"},"is_done":0,"gap_money":3400}]}
    console.log(data)
    this.setState({
      info: data,
      infoData: data.level,
      notice: data.material.readme,
    })
    Taro.setNavigationBarTitle({
      title: data.name
    })
  }

  async getPromoDiscern() {
    const {data} = await getPromoScan()
    console.log(data)
    this.setState({
      info: data,
      is_login: data.is_login,
      notice: data.material.readme,
      films: [...data.films,{},{},{}],
    })
    Taro.setNavigationBarTitle({
      title: data.name
    })
  }

  async getPromoLottery(fromWXTop?:boolean) {
    const {data} = await getLuckyShow(this.$router.params.share_uid || '', fromWXTop)
    console.log(data)
    this.setState({
      info: data,
      is_login: data.is_login,
      notice: data.material.readme,
      films: [...data.films,{},{},{}],
      infoData: data.draws.splice(4,0,{"id": -1, "name": '', "picurl": '' }) && data.draws,
    })
    Taro.setNavigationBarTitle({
      title: data.name
    })
  }

  async getPromoGroup(id?,force?) {
    const {data,status} = await getPromoGroup(force ? '' : (id || this.$router.params.together_id || ''))
    if (status) {
      console.log(data)
      this.setState({
        info: data,
        is_login: data.is_login,
        notice: data.material.readme,
        films: [...data.films,{},{},{}],
        isFull: data.join_list.length === data.material.need_user_limit
      })
      data.timeout_at && this.counting(data.timeout_at,true)
      Taro.setNavigationBarTitle({
        title: data.name
      })
    }
  }

  counting(n,first?) {
    if (n===0 || cting && first) return
    cting = true
    let num = n
    if (this.state.info.status === 10) {
      num = num - 1;
      if (num < 0) {
        this.getPromoGroup()
        cting = false
        return
      }
      this.setState({
        countingNum: secondToTime(num,true)
      })
    }
    setTimeout(() => {
      this.counting(num)
    }, 1000);
  }

  async getPromo() {
    const {data,status} = await getPromoShow(this.$router.params.type, this.$router.params.assist_id)
    if (status) {
      console.log(data)
      this.setState({
        info: data,
        is_login: data.is_login,
        notice: data.material.readme,
        films: [...data.films,{},{},{}],
        isFull: data.assist_list.length === data.material.need_user_limit
      })
      Taro.setNavigationBarTitle({
        title: data.name
      })
    }
  }

  componentWillUnmount () { }

  componentDidShow () { 
    if (Taro.getStorageSync('lastPage')) {
      Taro.setStorageSync('lastPage','')
      this.init()
    }
    if (Taro.getLaunchOptionsSync().scene === 1089 && this.$router.params.type === 'lottery') {
      this.getPromoLottery(true)
    }
  }

  componentDidHide () {
    
  }

  public onShareAppMessage(res) {
    return {
      title: this.state.info.share_title,
      imageUrl: this.state.info.share_img || '',
      path: `/pages/index/index?page=${this.state.info.share_url}`,
    };
  }
  
  taggleRules() {
    this.setState(pre => ({
      rulesShow: !pre.rulesShow
    }))
  }

  taggleAssist() {
    this.setState(pre => ({
      assistShow: !pre.assistShow
    }))
  }

  async btnClick() {
    if (this.state.info.is_running && !this.state.info.is_mine && !this.state.info.is_assist || !this.state.is_login) {
      // 助力
      const {data,status} = await postAssist(this.$router.params.assist_id)
      if (status === 1) {
        this.getPromo()
        this.taggleAssist()
      }
    } else if (this.state.info.is_running && this.state.info.is_mine && this.state.isFull) {
      // 查看
      Taro.navigateTo({
        url: '/pages/coupons/coupons'
      })
    }
  }

  async groupAction() {
    if (this.state.info.is_mine || (this.state.isFull && this.state.info.is_mine)) return
    if (this.state.info.my_together_id) {
      this.getPromoGroup(this.state.info.my_together_id)
      return
    }
    const {data} = await postPayGroup(this.state.isFull && !this.state.info.is_mine ? '' : (this.$router.params.together_id || '') )
    Taro.requestPayment({
      'timeStamp': data.timeStamp,
      'signType': data.signType,
      'nonceStr': data.nonceStr,
      'paySign': data.paySign,
      'package': data.package
    }).then(res => {
      this.getPromoGroup('', true)
    })
  }

  collect() {
    track(`promo_${this.$router.params.type}_collection`)
    this.setState({
      collectShow: true
    })
  }

  render () {
    const {info, notice, films, rulesShow, assistShow, isFull, collectShow, countingNum, infoData} = this.state
    return (
      <Report>
        <View className='body' style={`background:#fa3f50`}>
          {
            this.$router.params.type === 'assist' ?
            <Assist isFull={isFull} info={info} taggleRules={this.taggleRules.bind(this)} btnClick={this.btnClick.bind(this)}></Assist>
            : this.$router.params.type === 'together' ?
            <Group 
              isFull={isFull} 
              info={info} 
              countingNum={countingNum}
              taggleRules={this.taggleRules.bind(this)} 
              btnClick={this.groupAction.bind(this)} 
              films={films}
              refresh={this.getPromoGroup.bind(this)}
            ></Group>
            : this.$router.params.type === 'lottery' ?
            <Lottery 
              info={info} 
              draws={infoData}
              taggleRules={this.taggleRules.bind(this)}
            ></Lottery>
            : this.$router.params.type === 'discern' ?
            <Discern 
              info={info} 
              taggleRules={this.taggleRules.bind(this)}
            ></Discern>
            : this.$router.params.type === 'accumulate' ?
            <Accumulate
              info={info}
              draws={infoData}
            ></Accumulate>
            : this.$router.params.type === 'seckill' ?
            <Seckill
              info={info}
              taggleRules={this.taggleRules.bind(this)} 
              refresh={this.getPromoSec.bind(this)}
            ></Seckill>
            :
            <Block></Block>
          }
          {
            ['accumulate','seckill'].indexOf(this.$router.params.type) === -1  &&
            <Block>
              <View className="theone">
                <View className="titleIcon"></View>
                <View className="topic">看电影，官方自营票价最低</View>
                <View className="box">
                  <Image src={films[0].imageUrl} className="img"></Image>
                  <View className="info">
                    <View className="top">
                      <View className="title">{films[0].name}</View>
                      <View className="desc">{films[0].summary}</View>
                    </View>
                    <View className="filmbottom">
                      <View className="price">自营价：<Text>¥{films[0].price/100}</Text></View>
                      {
                        films[0].other_channel_prices && films[0].other_channel_prices.length > 0 &&
                        <View className="notPrice">淘票票：¥{films[0].other_channel_prices[0].price/100}    猫眼：¥{films[0].other_channel_prices[1].price/100}</View>
                      }
                      <View className="btnBox">
                        <View className="btnl flex" onClick={this.collect}>立即收藏</View>
                        <View className="btnr flex" onClick={this.toMovie.bind(this,films[0].id)}>优惠购票</View>
                      </View>
                    </View>
                  </View>
                  <View className="tips flex">官方自营</View>
                </View>
              </View>
              <View className="bottom">
                <View className="topic">
                  <View className="gang">
                    <View className="point">
                      <View className="title flex">热门电影推荐</View>
                    </View>
                  </View>
                </View>
                <View className="desc">官方自营小程序票价全网最低</View>
                <View className="movieBox">
                  {
                    films.map((item,index) => {
                      return (
                        <View className={item.imageUrl?"movie":'movie empty'} key={index}>
                          <Image src={item.imageUrl} className="image"></Image>
                          <View className="name">{item.name}</View>
                        </View>
                      )
                    })
                  }
                </View>
              </View>
              {
                assistShow &&
                <View className="assistWindow">
                  <View className="bg" onClick={this.taggleAssist}></View>
                  <View className="modal">
                    <View className="close" onClick={this.taggleAssist}></View>
                    <View className="titleIcon"></View>
                    <View className="topic">助力成功</View>
                    <View className="info">感谢你的助力，也送你一次免费获得爆米花的机会哦！</View>
                    <View className="btn flex">邀好友助力得爆米花
                      <Button openType="share"></Button>
                    </View>
                  </View>
                </View>
              }
              <Collect fromPromo={collectShow} closeCollect={() => {
                this.setState({
                  collectShow: false
                })
              }}></Collect>
            </Block>
          }
          {
            rulesShow &&
            <View className="rulesWindow">
              <View className="bg" onClick={this.taggleRules}></View>
              <View className="modal">
                <View className="close" onClick={this.taggleRules}></View>
                <View className="title">活动规则</View>
                  <View className="rulesDesc">
                    {
                      notice.map((item,index) => {
                        return (
                          <View key={index}>
                            <Text className="desc">{item}</Text>
                          </View>
                        )
                      })
                    }
                  </View>
              </View>
            </View>
          }
        </View>
      </Report>
    )
  }

  toMovie(filmId:number) {
    Taro.navigateTo({
      url: `/pages/movies/movies?filmId=${filmId}`
    })
  }
}

