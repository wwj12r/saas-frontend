import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block, Text, ScrollView, Input, Button, Swiper, SwiperItem, OpenData } from '@tarojs/components';
import './index.less'
import NewImg from '../newImg/index';
import { getLuckyShow, postLuckyDraw } from '../../api/index';
import Collect from '../collect/index';
import { track } from '../../utils/track';
type Props = {
  info: any,
  draws: any[],
  taggleRules: () => void,
}

interface Lottery{
  props: Props,
}

interface PageState {
  collectShow: boolean,
  lotteryIndex: number,
  chance: number,
  windowShow: number,
  getPrize: boolean,
  rolling: boolean,
}

const indexList = [0, 1, 2, 5, 8, 7, 6, 3]
let duration = 100
let round = 0
let propsChance = -1
let prize = {
  id: -1,
  name: '',
  picurl: '',
}

class Lottery extends Component<{}, PageState> {
  constructor() {
    super(...arguments)
    this.state = {
      rolling: false,
      getPrize: false,
      collectShow: false,
      windowShow: 0,
      chance: -1,
      lotteryIndex: -1,
    }
  }

  async componentDidMount() {
  }

  componentDidUpdate() {
    if (propsChance !== this.props.info.my_chance_times) {
      propsChance = this.props.info.my_chance_times
      if (this.state.chance !== this.props.info.my_chance_times) {
        this.setState({
          chance: this.props.info.my_chance_times
        })
      }
    }
  }

  async goRolling() {
    this.setState({
      windowShow: 0
    })
    if (this.state.chance === 0 && this.props.info.tasks.length > 0) {
      this.setState({
        windowShow: 2
      })
      return
    }
    track('promo_lottery_start')
    this.setState({
      rolling: !!(this.state.chance > 0),
    }, async () => {
      const {data} = await postLuckyDraw()
      this.rolling()
      prize = data.prize,
      this.setState({
        chance: data.my_chance_times
      })
    })
  }

  getIt() {
    this.setState({
      windowShow: 0,
      getPrize: true,
    }, () => {
      setTimeout(() => {
        this.setState({
          getPrize: false
        })
      }, 2000);
    })
  }

  getMore() {
    this.setState({
      windowShow: 0
    })
    this.props.info.tasks.length > 0 && Taro.pageScrollTo({
      scrollTop: 400
    })
  }

  rolling(num?: number) {
    let n = num || 0
    this.setState({
      lotteryIndex: indexList[n]
    }, () => {
      n = n + 1
      if (n > 7) {
        n = 0;
        prize.id > 0 && round ++ 
      }
      if (round === 2) {
        duration += 20
      } else if (this.props.draws[this.state.lotteryIndex].id === prize.id && round === 3) {
        setTimeout(() => {
          duration = 100
          round = 0
          this.setState({
            rolling: false,
            windowShow: 1
          })
        }, 1000);
        return
      }
      setTimeout(() => {
        this.rolling(n)
      }, duration);
    })
  }

  task(type) {
    if (!this.props.info.is_login) {
      postLuckyDraw()
      return
    }
    if (type === 'favicon') {
      this.setState({
        collectShow: true
      })
    } else if (type === 'share') {
      this.setState({
        windowShow: 3
      })
    }
  }

  render() {
    const { info, draws } = this.props
    const { lotteryIndex, chance, windowShow, collectShow, getPrize, rolling } = this.state
    const applogo = Taro.getStorageSync('app')
    return (
      <View className="top" style={`background:${info.material.background_color}`}>
        <Image src={info.material.background_img} className="image"></Image>
        <View className="rulesBtn flex" onClick={this.props.taggleRules}>活动规则</View>
        {
          info.material.float_img &&
          <Image src={info.material.float_img} mode="widthFix" className="floatImg" onClick={this.toIndex}></Image>
        }
        {
          info.tasks.length > 0 &&
          <View className="mission">
            <View className='topic'># 抽奖任务 #</View>
            {
              info.tasks.map((item,index) => {
                return (
                  <View className="task" key={index}>
                    <View className="info">
                      <Image src={item.picurl} className="img"></Image>
                      <View>
                        <View className="title">{item.name}</View>
                        <View className="desc">{item.desc}</View>
                      </View>
                    </View>
                    {
                      item.is_done ? 
                      <View className="gray btn flex">已完成</View>
                      :
                      <View className="btn flex" onClick={this.task.bind(this,item.type)}>{item.but_text}
                      {/* {
                        item.type === 'share' &&
                        <Button openType="share"></Button>
                      } */}
                      </View>
                    }
                  </View>
                )
              })
            }
          </View>
        }
        <View className="lottery">
          <View className="opp">您有<Text>{chance > -1 ? chance : info.my_chance_times}</Text>次抽奖机会</View>
          <View className="record" onClick={this.toRecord}>中奖纪录 >
          {
            getPrize &&
            <View className="anim">+1</View>
          }
          </View>
          <View className="lights">
            <Image src="https://img.xianxiapai.net/saas/lottery1.png" className="lightbefore"></Image>
            <Image src="https://img.xianxiapai.net/saas/lottery2.png" className="lightafter"></Image>
          </View>
          <View className="lotteryBox">
            {
              draws && draws.length > 0 && draws.map((item,index) => {
                return (
                  <View className={index === 4 ? "lotteryItem middle" : lotteryIndex === index ? "lotteryItem on" : "lotteryItem"} key={index}>
                    {
                      index === 4 ?
                      <Block>
                        {
                          rolling ?
                          <View className="inner flex gray">
                            <View className='topic'>抽奖中</View>
                          </View>
                          :
                          <View className="inner middleBG flex" onClick={this.goRolling}>
                            <View className='topic'>点击抽奖</View>
                            <View className='btn flex'>100%中奖</View>
                          </View>
                        }
                      </Block>
                      :
                      <Block>
                        <View className="inner flex">
                          <NewImg url={item.picurl}></NewImg>
                          <View className="lotteryName">{item.name}</View>
                        </View>
                        <View className="border"></View>
                      </Block>
                    }
                  </View>
                )
              })
            }
          </View>
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
                  <View className="topic">恭喜您获得</View>
                  <View className="flex">
                    <NewImg url={prize.picurl}></NewImg>
                  </View>
                  <View className="prizeName">{prize.name}</View>
                  {
                    (chance === 0 && info.tasks.length === 0) ?
                    <View className="btn flex" onClick={this.getIt}>立即收下</View>
                    :
                    <View className="btn flex" onClick={this.getMore}>继续抽奖</View>
                  }
                </Block>
                : windowShow === 2 ?
                <Block>
                  <View className="topic">剩余抽奖次数不足</View>
                  <View className="btn flex" onClick={this.getMore}>获得更多次数</View>
                </Block>
                : windowShow === 3 ?
                <Block>
                  <Text className="topic">分享到群\n从群内点击进入即可获得奖励</Text>
                  <View className="shareInfo">
                    <OpenData type='userAvatarUrl' className="avatar"/>
                    <View className="shareBox">
                      <View className="appInfo">
                        <Image className="applogo" src={applogo && applogo.split('|')[1]}></Image>
                        <View className="appname">{applogo && applogo.split('|')[0]}官方活动</View>
                      </View>
                      <View className="title">{info.share_title}</View>
                      {/* <View className='shareImg'>
                        <NewImg url={info.share_img}></NewImg>
                      </View> */}
                      <Image src={info.share_img} className="shareImg"></Image>
                      <View className="xcx">小程序</View>
                    </View>
                  </View>
                  <View className="btn flex" onClick={()=>{
                    this.setState({
                      windowShow: 0
                    })
                  }}>立即分享到群
                    <Button openType="share"></Button>
                  </View>
                </Block>
                :
                <Block></Block>
              }
            </View>
          </View>
        }
        <Collect fromPromo={collectShow} fromPromoLottery={true} closeCollect={() => {
          this.setState({
            collectShow: false
          })
        }}></Collect>
      </View>
    )
  }

  toIndex() {
    track('promo_lottery_gotobuy')
    Taro.reLaunch({
      url: this.props.info.material.float_pages
    })
  }

  toRecord() {
    if (!this.props.info.is_login) {
      postLuckyDraw()
      return
    }
    track('promo_lottery_record')
    Taro.navigateTo({
      url: `/pages/record/record`
    })
  }
}

export default Lottery