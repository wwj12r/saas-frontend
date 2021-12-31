import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Block, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import './movies.less'
import { connect } from '@tarojs/redux'
import { getMovieList } from '../../actions/counter'
import { CinemaData, FilmsData, shows, IconsData } from '../../store/movies/interface';
import { timeCalculator, dateToNowadays, removeYear } from '../../utils/common';
import Report from '../../components/reportSubmit/index';
import { track } from '../../utils/track';
import Api from '../../api/request';
interface PageState {
  currentDateIndex: number,
  currentMovieIndex: number,
  currentShowIndex: number,
  moved: boolean,
  // cinema: CinemaData,
  // films: FilmsData[],
  // icons: IconsData[],
}
type PageDispatchProps = {
  getMovieList: () => any;
  info: any;
}
type PageOwnProps = {
}
type IProps = PageDispatchProps & PageOwnProps
interface Movies {
  props: IProps;
}

@connect(({ info }) => ({
  info
}), (dispatch) => ({
  getMovieList () {
    return dispatch(getMovieList());
  }
}))

class Movies extends Component<{},PageState> {
  config: Config = {
    navigationBarTitleText: '影片'
  }
  constructor(props) {
    super(props)
    this.state = {
      // icons: [],
      moved: false,
      currentDateIndex: 0,
      currentMovieIndex: 0,
      currentShowIndex: 0,
      // cinema: {
      //   cinemaName: '',
      //   address: '',
      //   city: '',
      //   id: 0,
      //   tags: '',
      // },
      // films: [],
    }
  }

  componentWillMount () { }

  async componentDidMount () { 
    await Api.login()
    track('movies_enter')
    this.getCommonMovies()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () {
    
  }

  async getCommonMovies() {
    await this.props.getMovieList()
    console.log(this.props.info)
    if (this.$router.params.filmId) {
      const index = this.props.info.films.findIndex(item => item.id == this.$router.params.filmId)
      index ? this.chooseMovie(index) : this.setState({moved: true})
    } else {
      this.setState({moved: true})
    }
  }

  movieChange(e:any) {
    if (!this.state.moved) {
      const cur = this.props.info.films[this.state.currentMovieIndex]
      if (cur && this.$router.params.filmId == cur.id) {
        this.setState({
          moved: true
        })
      }
    }
    if (e.detail.source === 'touch') {
      this.chooseMovie(e.detail.current)
    }
  }

  chooseMovie(index:number) {
    if (!this.state.moved) {this.setState({moved: true})}
    track('movies_change')
    this.setState({
      currentShowIndex: 0,
      currentDateIndex: 0,
      currentMovieIndex: index
    })
  }

  nextDate() {
    this.setState({
      currentDateIndex: 1
    })
  }

  chooseDate(index:number) {
    this.setState({
      currentShowIndex: 0,
      currentDateIndex: index
    })
  }

  showCompare(index:number) {
    this.setState(pre => ({
      currentShowIndex: pre.currentShowIndex === index ? -1 : index
    }))
  }

  render () {
    const { currentMovieIndex, currentDateIndex, currentShowIndex, moved} = this.state
    const { films, cinema, icons } = this.props.info
    return (
      <Report>
        <View className='body'>
          {
            films.length>0&&
            <View className="top">
              <View className="info">
                <View className="cinema">
                  <View className="name">{cinema.cinemaName}</View>
                  <View className="address">{cinema.address}</View>
                  <View className="stateBox">
                    {
                      cinema.tags&&cinema.tags.split(',').map((item,index) => {
                        return (
                          <View className="state" key={index}>{item}</View>
                        )
                      })
                    }
                  </View>
                </View>
                <View className="extra">
                  <View className="vip" onClick={this.toCardInfo}>会员卡</View>
                  <View className="snack" onClick={this.toSalePage}>小食</View>
                </View>
              </View>
              <View className="swiper">
                <Swiper
                  display-multiple-items="5"
                  onChange={this.movieChange}
                  current={currentMovieIndex}
                  >
                  <SwiperItem className="swiperLeft"></SwiperItem>
                  <SwiperItem className="swiperLeft"></SwiperItem>
                  {
                    films.map((item,index) => {
                      return (
                        <SwiperItem className="swiperItem flex" key={index} onClick={this.chooseMovie.bind(this,index)}>
                          <View className={index===currentMovieIndex ? 'moviePic on' : 'moviePic'}>
                            <Image src={item.imageUrl}></Image>
                          </View>
                        </SwiperItem>
                      )
                    })
                  }
                  <SwiperItem className="swiperRight"></SwiperItem>
                  <SwiperItem className="swiperRight"></SwiperItem>
                </Swiper>
              </View>
            </View>
          }
          {
            moved && films.length>0 &&
            <Block>
              <View className="middle flex">
                <View className="title">{films[currentMovieIndex].name}</View>
                <View className="info">{films[currentMovieIndex].summary}</View>
              </View>
              <View className="bottom">
                <ScrollView className="date" scrollX>
                  {
                    films[currentMovieIndex].dateSchedules.length>0&&
                    films[currentMovieIndex].dateSchedules.map((item,index) => {
                      return (
                        <View className={index === currentDateIndex ? "dateTxt on" : "dateTxt"} key={index} onClick={this.chooseDate.bind(this,index)}>
                          <View className="flex">{dateToNowadays(item.date) + '/' + removeYear(item.date)}</View>
                        </View>
                      )
                    })
                  }
                </ScrollView>
                {
                  // <View className="ads">
                  //   <View>充100得120，再送爆米花2份+电影票2张</View>
                  // </View>
                }
                <View className="sceneBox">
                  {
                    films[currentMovieIndex].dateSchedules[currentDateIndex].shows.length>0 &&
                    films[currentMovieIndex].dateSchedules[currentDateIndex].shows.map((item,index) => {
                      return (
                        <View className="scenes" key={index}>
                          <View className="scene" onClick={this.showCompare.bind(this,index)}>
                            <View className="time">
                              <View className="start">{timeCalculator(item.showTime)}</View>
                              <View className="end">{timeCalculator(item.endTime)}结束</View>
                            </View>
                            <View className="site">
                              <View className="type">{item.showVersion}</View>
                              <View className="number">{item.hallName}</View>
                            </View>
                            <View className="price">
                              <View className="present"><Text>{item.member.price/100 || item.sellPrice/100}</Text>元</View>
                              <View className="vip">实时比价</View>
                            </View>
                          </View>
                          {
                            index === currentShowIndex &&
                            <View className="compare">
                              <View className="self compareItem" onClick={this.toSeat.bind(this,item)}>
                                <View className="time">
                                  <View className="start">
                                  <View className="icon" style={`background-image:url(${icons.length>0&&icons.find(icon => icon.code === 0)!.icon})`}></View>
                                  影院官方
                                  </View>
                                </View>
                                <View className="price">
                                  {
                                    item.member.price?
                                    <Block>
                                      <View className="present">会员<Text>{item.member.price/100}</Text>元</View>
                                      <View className="vip">原价{item.sellPrice/100}元</View>
                                    </Block>
                                    :
                                    <View className="present"><Text>{item.sellPrice/100}</Text>元</View>
                                  }
                                </View>
                                <View className="btn flex">购票</View>
                              </View>
                              {
                                item.prices.length > 0 &&
                                item.prices.map((channel,index) => {
                                  return (
                                    <View className="maoyan compareItem" key={index}>
                                      <View className="time">
                                        <View className="start">
                                          <View className="icon" style={`background-image:url(${icons.find(icon => icon.code === channel.code)!.icon})`}></View>
                                          {icons.find(icon => icon.code === channel.code)!.name}
                                        </View>
                                      </View>
                                      <View className="price">
                                        <View className="present"><Text>{channel.price/100}</Text>元</View>
                                      </View>
                                    </View>
                                  )
                                })
                              }
                            </View>
    
                          }
                        </View>
                      )
                    })
                  }
                  {
                    films[currentMovieIndex].dateSchedules[currentDateIndex].shows.length===0 &&
                    <View className="todayNone flex">
                      <Text>今天 暂无场次</Text>
                      <View className="btn flex" onClick={this.nextDate}>查看其他日期</View>
                    </View>
                  }
                </View>
              </View>
            </Block>
          }
        </View>
      </Report>
    )
  }

  toCardInfo() {
    track('movies_card')
    Taro.navigateTo({
      url: `/pages/cardInfo/cardInfo`
    })
  }

  toSalePage() {
    track('movies_sale')
    Taro.navigateTo({
      url: `/pages/salePage/salePage`
    })
  }

  toSeat(item:shows) {
    track('movies_seat')
    Taro.navigateTo({
      url: `/pages/seat/seat?scheduleId=${item.id}`
    })
  }
}

export default Movies