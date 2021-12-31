import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, MovableArea, MovableView, Image, ScrollView, Block } from '@tarojs/components'
import './seat.less'
import { connect } from '@tarojs/redux'
import { getMovieList } from '../../actions/counter'
import { CinemaData, FilmsData } from '../../store/movies/interface';
import { HallData, ScheduleData, SectionsData, SeatsData, SeatTypes, SeatData, priceData, benefitData } from '../../store/seat/interface';
import { timeCalculator, dateToNowadays, rpx2px } from '../../utils/common';
import { getSeats, OrderBuy } from '../../api/index';
import Report from '../../components/reportSubmit/index';
import { track } from '../../utils/track';
import Ticket from '../../components/ticket/index';
interface pageState {
  cardPriceInfo: benefitData,
  film: FilmsData,
  cinema: CinemaData,
  hall: HallData,
  schedule: ScheduleData,
  sections: SectionsData[],
  seatTypes: SeatTypes[],
  screenLeft: number,
  scale: number,
  lineHeight: number,
  lineTop: number,
  selected: SeatData[],
  total: number,
  benefitSaleTips: any,
  card: any,
  useBenefitCard: boolean,
}
type PageDispatchProps = {
  getMovieList: () => any;
  info: any;
}
type PageOwnProps = {
}
type IProps = PageDispatchProps & PageOwnProps
interface Seat {
  props: IProps;
}

let seatsWidth,seatsHeight,shiftLeft,shiftTop;
let prices:priceData[]

@connect(({ info }) => ({
  info
}), (dispatch) => ({
  getMovieList () {
    return dispatch(getMovieList());
  }
}))

class Seat extends Component<{},pageState> {
  config: Config = {
    navigationBarTitleText: '',
    disableScroll: true
  }

  constructor() {
    super(...arguments)
    this.state = {
      total: 0,
      selected: [],
      lineHeight: 0,
      lineTop: 0,
      screenLeft: 0,
      scale: 1,
      seatTypes:[],
      cardPriceInfo: {},
      cinema: {},
      film: {},
      hall: {
        hallName: '',
      },
      schedule: {
        showTime: '00-00-00',
        showDate: '2019-01-01'
      },
      sections: [],
      benefitSaleTips: {},
      card: {},
      useBenefitCard: false,
    }
  }

  componentWillMount () { }

  componentDidMount () { 
    track('seat_enter')
    this.initSeats()
  }

  componentWillUnmount () { }

  componentDidShow () { 
    if (Taro.getStorageSync('lastPage').includes('orderId')) {
      const getOrderId = Taro.getStorageSync('lastPage')
      Taro.setStorageSync('lastPage', '')
      Taro.showModal({
        title: '',
        content: '确定不要刚才选择的座位了吗？',
        confirmText: '继续购票',
        cancelText: '不要了',
      }).then(res => {
        res.confirm && Taro.navigateTo({
          url:`/pages/order/order?orderId=${getOrderId.split('=')[1]}&type=ticket`
        })
        res.cancel && this.initSeats()
      })
    } else if (Taro.getStorageSync('refresh')) {
      Taro.setStorageSync('refresh', '')
      this.initSeats()
    }
  }

  componentDidHide () {
    
  }

  async initSeats() {
    const {data,status,message} = await getSeats(this.$router.params.scheduleId)
    if (status === 1) {
      console.log(data)
      this.setState({
        seatTypes: data.seatTypes,
        cinema: data.cinema,
        film: data.film,
        hall: data.hall,
        schedule: data.schedule,
        sections: data.sections,
        selected: [],
        total: 0,
        cardPriceInfo: data.cardPriceInfo,
        benefitSaleTips: data.benefitSaleTips,
        card: data.card
      },() => {
        this.countingSeatArea()
      })
      seatsWidth = data.sections[0].columnCount*50 + 160    //width:40;margin:5px 0; padding: 0 80px 120px;
      seatsHeight = data.sections[0].rowCount*50     //height:50px;
      shiftLeft = rpx2px(seatsWidth) - Taro.getSystemInfoSync().windowWidth/2;
      shiftTop = rpx2px(seatsHeight) - Taro.getSystemInfoSync().windowHeight/2*0.5;
      prices = data.prices
    } else {
      Taro.showModal({
        title: '',
        content: message
      }).then(() => {
        this.props.getMovieList()
        Taro.navigateBack()
      })
    }
  }

  getSeatType(item) {
    if (!item.status) return 'seat empty'
    let res = 'seat';
    (item.status === 2 || item.damaged === "Y") && (res += ' sold'); //坏了或者已售
    item.status === 3 && (res += ' selected'); //已选
    item.type === "DL" && (res += ' dl');  //情侣左
    item.type === "DR" && (res += ' dr')   //情侣右
    return res
  }

  countingSeatArea() {
    const query = Taro.createSelectorQuery()
    query.select('#seatView').boundingClientRect()
    query.exec((res) => {
      let height = res[0].height;
      let top = res[0].top;
      let left = res[0].left;
      let width = res[0].width;
      let newLeft = (width - rpx2px(404))/2 + left
      let newHeight = height / this.state.sections[0].rowCount;
      this.setState({
        screenLeft: newLeft,
        lineHeight: newHeight,
        lineTop: top
      })
    })
  }

  orderSeat(selectItem:SeatData) {
    console.log(selectItem)
    if (!selectItem.status || selectItem.status === 2 || selectItem.status === 5) return
    let selected = this.state.selected
    let newSections = this.state.sections
    let findThisColumns = newSections[0].seats[selectItem.y-1].columns
    let findThisOne = findThisColumns[selectItem.x-1]
    let singlePrice = prices.find(item => item.areaId === selectItem.areaId)!.price/100; 
    let benefitPrice = this.state.cardPriceInfo&&this.state.cardPriceInfo.prices.find(item => item.areaId === selectItem.areaId)!.price/100
    let total = 0

    if (findThisOne.type === 'N') {
      switch (findThisOne.status) {
        case 1:
          if (selected.length === this.state.cinema.maxTicketNum) {
            Taro.showToast({
              title: `一次最多购买${this.state.cinema.maxTicketNum}张`,
              icon: 'none'
            })
            return
          }
          findThisOne.status = 3
          selected.push(selectItem)
          track('seat_pick')
          break
        case 3:
          findThisOne.status = 1
          selected.splice(selected.findIndex(item => item.name === findThisOne.name),1)
          track('seat_delete')
          break
      }
    } else {
      switch (findThisOne.status) {
        case 1:
          if (selected.length > this.state.cinema.maxTicketNum - 2) {
            Taro.showToast({
              title: `一次最多购买${this.state.cinema.maxTicketNum}张`,
              icon: 'none'
            })
            return
          }
          let otherSeat = findThisOne.type === 'DL' ? findThisColumns[selectItem.x] : findThisColumns[selectItem.x - 2]
          findThisOne.status = 3
          otherSeat.status = 3
          selected = [...selected,findThisOne,otherSeat]
          track('seat_pick')
          break
        case 3:
          let otherSeat2 = findThisOne.type === 'DL' ? findThisColumns[selectItem.x] : findThisColumns[selectItem.x - 2]
          findThisOne.status = 1
          otherSeat2.status = 1
          selected.splice(selected.findIndex(item => item.name === findThisOne.name),1)
          selected.splice(selected.findIndex(item => item.name === otherSeat2.name),1)
          track('seat_delete')
        break
      }
    }

    selected.map((item,index) => {
      if (this.state.cardPriceInfo&&index < this.state.cardPriceInfo.buyLimit) {
        total += benefitPrice
        Object.assign(item,{cardPriceInfo:this.state.cardPriceInfo})
      } else if (this.state.useBenefitCard && index < this.state.card.benefit.buyLimit) {
        total += prices.find(item => item.areaId === selectItem.areaId)!.benefit_sell_price/100
      } else {
        total += singlePrice
      }
    })

    selected.length === 0 && this.state.useBenefitCard && this.addCard()

    this.setState({
      total: selected.length === 0 ? 0 : total + (this.state.useBenefitCard ? this.state.card.benefit.cardPrice/100 : 0),
      selected: selected,
      sections: newSections
    })
  }

  addCard() {
    let selected = this.state.selected
    let total = 0
    selected.map((items,index) => {
      if (!this.state.useBenefitCard && index < this.state.card.benefit.buyLimit) {
        total += prices.find(item => item.areaId === items.areaId)!.benefit_sell_price/100
      } else {
        total += prices.find(item => item.areaId === items.areaId)!.price/100
      }
    })
    this.setState(pre => ({
      useBenefitCard: !pre.useBenefitCard,
      total: total + (this.state.useBenefitCard ? 0 : this.state.card.benefit.cardPrice/100),
    }))
  }

  async checkSeats() {
    track('seat_order')
    let newSections = this.state.sections[0]
    const checkSeat = (item) => {
      const thisColumns = newSections.seats[item.y-1].columns
      const last2Seat = thisColumns[item.x-3] ? thisColumns[item.x-3].status : 2
      const lastSeat = thisColumns[item.x-2] ? thisColumns[item.x-2].status : -1
      const nextSeat = thisColumns[item.x] ? thisColumns[item.x].status : -1
      const next2Seat = thisColumns[item.x+1] ? thisColumns[item.x+1].status : 2
      // 左右两边都有座
      if ((lastSeat===1 && nextSeat===1) || (lastSeat===1&&nextSeat===-1) || (lastSeat===-1&&nextSeat===1)) {
        // 左空1或者右空1
        if ((last2Seat!=1 && lastSeat===1) || (nextSeat===1 && next2Seat!=1)) {
          return true
        }
      }
      return false
    }
    if (this.state.selected.some(checkSeat)) {
      Taro.showToast({
        title: '座位旁边不要留空',
        icon: 'none'
      })
    } else {
      const {data,status,message} = await OrderBuy(this.state.schedule.id,this.state.selected)
      if (status === 1) {
        Taro.navigateTo({
          url: `/pages/order/order?orderId=${JSON.stringify(data.order)}&type=ticket${this.state.useBenefitCard?'&addCard=true':''}`
          // url: `/pages/order/order?orderId=123&type=ticket`
        })
      } else if (status === 10001) {
        this.initSeats()
        Taro.showModal({
          title: '',
          content: message,
          showCancel: false
        })
      }
    }
  }

  countBestArea(sections) {
    const y = sections[0].seats.length
    const x = sections[0].seats[0].columns.length
    return {
      top: `${Math.floor(y/3)*50-5}rpx`,
      height: `${(y-Math.floor(y/3)*2)*50}rpx`,
      left: `${Math.floor(x/3)*48}rpx`,
      width: `${(x-Math.floor(x/3)*2)*48-2}rpx`
    }
  }

  autoChoose(index) {
    const dimond = 1.3    //菱形系数  (1 +) 1<> 1.5《》
    const seat = this.state.sections[0].seats
    const width = seat[0].columns.length
    const height = seat.length
    const middleX = width % 2 === 0 ? Math.floor((width + 1)/2) : Math.ceil((width + 1)/2)
    const middleY = Math.ceil((height + 1)/2)
    let i = 0
    // 查看以x为中心是否是连续空座
    const checkAvailable = (x, y, length) => {
      for (let n = 1-Math.ceil(length/2); n < length-Math.ceil(length/2)+1; n ++) {
        i ++
        const theSeat = seat[y-1].columns[x + n-1]
        if ((theSeat && theSeat.status !== 1) || (theSeat && theSeat.type !== 'N')) {
          return false
        }
      }
      console.log(i)
      return true
    }
    // 单排找最好位置
    const checkEachY = y => {
      for (let n = 0; n < middleX; n ++) {
        if (checkAvailable(middleX + n,y,index)) {
          return middleX + n
        } else if (n > 0 && checkAvailable(middleX - n,y,index)) {
          return middleX - n
        }
      }
      return -1
    }
    const chooseTheBestOne = () => {
      let bestSeats = {x: -1,y: -1};
      let mininum = 10000;
      for (let n = 0; n < seat.length/2; n ++) {
        const theX = checkEachY(middleY + n)
        if (n === 0) {
          if (middleX === theX) return {x: middleX, y: middleY}
          mininum = Math.abs(middleX - theX)
          bestSeats = {x: theX, y: middleY}
          continue
        }
        const the_X = checkEachY(middleY - n)
        if ((Math.abs(middleX - theX) + n * dimond) < mininum) {
          mininum = Math.abs(middleX - theX)
          bestSeats = {x: theX,y: middleY + n}
        } else if (the_X > 0 && (Math.abs(middleX - the_X) + n * dimond) < mininum) {
          mininum = Math.abs(middleX - the_X)
          bestSeats = {x: the_X,y: middleY - n}
        }
      }
      return bestSeats
    }
    const {x,y} = chooseTheBestOne()
    for (let n = 1-Math.ceil(index/2); n < index-Math.ceil(index/2)+1; n ++) {
      const theOne = seat[y-1].columns[x-1+n]
      this.orderSeat(theOne)
    }
  }

  render () {
    const { film, seatTypes, cinema, hall, schedule, sections, lineTop, lineHeight, screenLeft, selected, total, 
      cardPriceInfo, benefitSaleTips, card, useBenefitCard } = this.state
    return (
      <Report>
        <View className='body'>
          <View className="preload">
          {seatTypes.map((item,index) => {return (<Image src={item.icon} key={index}></Image>)})}
          </View>
          <View className="top">
            {
              film.name &&
              <View className="title">
                <View className="name">{film.name}</View>
                <View className="info">
                  <Text>{dateToNowadays(schedule.showDate)}</Text>
                  <Text>{` ${schedule.showDate.split('-')[1]}月${schedule.showDate.split('-')[2]}日 `}</Text>
                  <Text>{timeCalculator(schedule.showTime)} 场 </Text>
                  <Text>{schedule.showVersion}</Text>
                </View>
              </View>
            }
            <View className="seat">
              {
                seatTypes.length > 0 && 
                <Block>
                  {
                    seatTypes.map((item,index) => {
                      return (
                        index < 4 && item.name !== '已选' &&
                        <View key={index} className="seatList flex">
                          <View style={`background-image:url(${item.icon})`} className={index > 2 ? "seatIcon couple":"seatIcon"}></View>
                          <Text className="seatName">{item.name}</Text>
                        </View>
                      )
                    })
                  }
                  <View className="seatList flex">
                    <View className="seatIcon bestAreaIcon"></View>
                    <Text className="seatName">最佳观影区</Text>
                  </View>
                </Block>
              }
            </View>
          </View>
          {
            sections.length>0 && 
            <MovableArea className="movableArea" scaleArea={true}>
              <View className="screen flex" style={`left:${screenLeft}px`}>{`${hall.hallName} 银幕`}</View>
              <MovableView 
                id='movable-view' 
                className="movableView" 
                direction="all" 
                onChange={this.countingSeatArea} 
                onScale={this.countingSeatArea} 
                scale={true} 
                scaleMin={1}
                scaleMax={1.8}
                scaleValue={1}
                x={-shiftLeft}
                y={-shiftTop}
                style={`width:${seatsWidth*2}rpx;height:${seatsHeight*2}rpx;`}
                inertia={true}
                >
                <View className='seats' id='seatView'>
                  <View className='seatView'>
                    {
                      sections.length>0&&sections[0].seats.length > 0 &&
                      <Block>
                        <View className="bestArea" style={this.countBestArea(sections)}></View>
                        {
                          sections[0].seats.map((items, index) => {
                            return (
                              <View className='seatY' key={index}>
                                {
                                  items.columns.length > 0 &&
                                  items.columns.map((item, index) => {
                                    return (
                                      <View 
                                        className={this.getSeatType(item)} 
                                        key={index} 
                                        style={`${item.status ? `background-image:url(${(item.type === "DL"||item.type === "DR")?seatTypes[item.status+2].icon:seatTypes[item.status-1].icon})`:''}`}
                                        onClick={this.orderSeat.bind(this,item)}
                                      >
                                      </View>
                                    )
                                  })
                                }
                              </View>
                            )
                          })
                        }
                      </Block>
                    }
                  </View>
                  <View className="mLine"></View>
                </View>
              </MovableView>
              <View className='lLine' style={`top:${lineTop}px`}>
                {
                  sections[0].seats.map((item,index) => {
                    return (
                      <Text className='text flex' style={`height:${lineHeight}px`} key={index}>{item.rowId}</Text>
                    )
                  })
                }
              </View>
            </MovableArea>
          }
          <View className="bottom">
            {
              selected.length > 0 ?
              <View className="detail">
                {
                  benefitSaleTips.text &&
                  <View className="cardInfoBanner flex">
                    <Text className="info">{benefitSaleTips.text}<Text className="red">￥{benefitSaleTips.price/100 * (selected.length > card.benefit.buyLimit ? card.benefit.buyLimit : selected.length)}</Text></Text>
                    <View className={`add flex ${useBenefitCard?'gray':''}`} onClick={this.addCard}>{useBenefitCard?'取消':'添加'}</View>
                  </View>
                }
                <View className="title">您已选定{selected.length}个座位</View>
                <ScrollView className="selectedList" scroll-x>
                  <View className="block"></View>
                  {
                    useBenefitCard &&
                    <Ticket info={{name: '权益卡', type: 'benefit'}} index={-1} prices={card.benefit.cardPrice/100} orderSeat={this.addCard.bind(this)}></Ticket>
                  }
                  {
                    selected.map((item,index) => {
                      return (
                        <Ticket useBenefitCard={useBenefitCard} card={card} key={index} info={item} index={index} cardPriceInfo={cardPriceInfo} prices={prices} orderSeat={this.orderSeat.bind(this)}></Ticket>
                      )
                    })
                  }
                </ScrollView>
              </View>
              :
              cinema.maxTicketNum &&
              <View className="autoChoose">
                <View className="title">推荐座位</View>
                <ScrollView className="numBox" scrollX={true}>
                {
                  Array(Number(cinema.maxTicketNum)).fill('').map((item, index) => {
                    return (
                      <View key={index} className="num" onClick={this.autoChoose.bind(this,index+1)}>
                        <View className="flex">{index+1}人</View>
                      </View>
                    )
                  })
                }
                </ScrollView>
              </View>
            }
            {
              total?
              <View className="btn flex" onClick={this.checkSeats}>
                <Text>￥{total}</Text> 
                确定选座
              </View>
              :
              <View className="btn flex gray">请先选座</View>
            }
          </View>
        </View>
      </Report>
    )
  }
}

export default Seat