import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Block, Image, ScrollView } from '@tarojs/components';
import '../sale/sale.less'
import { connect } from '@tarojs/redux'
import { saveSnack } from '../../actions/counter'
import Snack from '../../components/snack/index';
import { GoodsData, selectedGoods } from '../../store/snack/interface';
import { getGoods } from '../../api/index';
import Cumulation from '../../components/cumulation/index';
import Report from '../../components/reportSubmit/index';
import { goSomewhere } from '../../utils/common';
import { track } from '../../utils/track';
interface pageState {
  goodsList: any[],
  // goodsList: GoodsData[],
  selectedShow: boolean,
  count: number,
  total: number,
  goodsBanner: any[],
  valueList: any[],
  typeIndex: number,
  listHeight: number,
  scrollIndex: number,
  selectList: any[],
}
type PageDispatchProps = {
  saveSnack: (e) => Promise<any>;
}
type PageOwnProps = {
  counter: any
}
type IProps = PageDispatchProps & PageOwnProps
interface SalePage {
  props: IProps;
}

let topList = [100000];

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  saveSnack (e) {
    dispatch(saveSnack(e))
  }
}))



class SalePage extends Component<{},pageState> {
  config: Config = {
    navigationBarTitleText: '卖品',
    enablePullDownRefresh: true,
  }

  constructor() {
    super(...arguments)
    this.state = {
      scrollIndex: 0,
      listHeight: 0,
      typeIndex: 0,
      goodsBanner: [],
      count: 0,
      total: 0,
      selectedShow: false,
      goodsList: [],
      valueList: [],
      selectList: [],
    }
  }

  componentWillMount () { }

  componentDidMount () { 
    track('sale_enter')
    this.getGoods()
  }

  onPullDownRefresh() {
    this.getGoods()
    Taro.stopPullDownRefresh()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () {
    this.setState({
      selectedShow: false
    })
  }

  async getGoods() {
    const {data,status} = await getGoods()
    if (status) {
      // const test = [{"id":"default","name":"\u9ed8\u8ba4","child":[{"id":10,"goodsName":"\u5355\u4eba\u4f18\u4eab\u5957\u9910","packageFlag":"Y","standardPrice":2400,"category":"default","desc":"16oz\u4e2d\u676f\u53ef\u4e501\u676f+46oz\u4e2d\u4efd\u7206\u7c73\u82b11\u4efd","status":0,"isRecommend":1,"imageUrl":"https:\/\/img.xianxiapai.net\/longxia\/image\/20191011\/5f2940fb0c363e843f5f28fc1f580f54.jpg","buyLimit":20},{"id":11,"goodsName":"\u53cc\u4eba\u5206\u4eab\u5957\u9910","packageFlag":"Y","standardPrice":2900,"category":"default","desc":"16oz\u4e2d\u676f\u53ef\u4e502\u676f+46oz\u4e2d\u4efd\u7206\u7c73\u82b11\u4efd","status":0,"isRecommend":1,"imageUrl":"https:\/\/img.xianxiapai.net\/longxia\/image\/20191011\/306d78b660d28c9e89d9fda183d95bad.jpg","buyLimit":20},{"id":19,"goodsName":"\u6696\u5fc3\u5957\u9910","packageFlag":"Y","standardPrice":4500,"category":"default","desc":"\u9999\u98d8\u98d8\u725b\u4e73\u83362\u74f6+46oz\u4e2d\u4efd\u7206\u7c73\u82b11\u4efd","status":0,"isRecommend":0,"imageUrl":"https:\/\/img.xianxiapai.net\/longxia\/image\/20191011\/42d1930b61748efa3507a27ac6d1c4e0.jpg","buyLimit":20},{"id":20,"goodsName":"\u70ed\u996e\u5957\u9910","packageFlag":"Y","standardPrice":2500,"category":"default","desc":"12oz\u5976\u83361\u676f+46oz\u4e2d\u4efd\u7206\u7c73\u82b11\u4efd","status":0,"isRecommend":0,"imageUrl":"https:\/\/img.xianxiapai.net\/longxia\/image\/20191011\/421eb5054e87f370d59c928bd5272dbe.jpeg","buyLimit":20},{"id":21,"goodsName":"\u5065\u5eb7\u5957\u9910","packageFlag":"Y","standardPrice":3200,"category":"default","desc":"535ml\u77ff\u6cc9\u6c342\u74f6+46oz\u4e2d\u4efd\u7206\u7c73\u82b11\u4efd","status":0,"isRecommend":0,"imageUrl":"https:\/\/img.xianxiapai.net\/longxia\/image\/20191011\/1b93b38c1ac4f46512948bb1f3db2cea.jpg","buyLimit":20},{"id":23,"goodsName":"\u4f18\u76ca\u5957\u9910","packageFlag":"Y","standardPrice":2700,"category":"default","desc":"\u4f18\u76caC1\u74f6+46oz\u4e2d\u4efd\u7206\u7c73\u82b11\u4efd","status":0,"isRecommend":0,"imageUrl":"https:\/\/img.xianxiapai.net\/longxia\/image\/20191011\/c181024b84f16a432d6bd676d12de15a.jpg","buyLimit":20},{"id":24,"goodsName":"\u968f\u4fbf\u5957\u9910","packageFlag":"Y","standardPrice":2600,"category":"default","desc":"\u8336\u6d3e1\u74f6+46oz\u4e2d\u4efd\u7206\u7c73\u82b11\u4efd","status":0,"isRecommend":0,"imageUrl":"https:\/\/img.xianxiapai.net\/longxia\/image\/20191011\/48450c2d9ab006be42d6b5f8f3642e48.jpg","buyLimit":20},{"id":25,"goodsName":"\u5bb6\u5ead\u5957\u9910","packageFlag":"Y","standardPrice":6800,"category":"default","desc":"22oz\u5927\u676f\u53ef\u4e503\u676f+85oz\u5927\u4efd\u7206\u7c73\u82b12\u4efd","status":0,"isRecommend":0,"imageUrl":"https:\/\/img.xianxiapai.net\/longxia\/image\/20191011\/51841620bab0a70759006f0f07725edc.jpg","buyLimit":20},{"id":26,"goodsName":"\u5976\u8336.","packageFlag":"N","standardPrice":1000,"category":"default","desc":"12oz\u5976\u83361\u676f","status":0,"isRecommend":0,"imageUrl":"https:\/\/img.xianxiapai.net\/longxia\/image\/20191011\/5ce08ce46a46015a019e5f920fa699c1.png","buyLimit":20},{"id":27,"goodsName":"\u5496\u5561.","packageFlag":"N","standardPrice":1000,"category":"default","desc":"12oz\u5496\u55611\u676f","status":0,"isRecommend":0,"imageUrl":"https:\/\/img.xianxiapai.net\/longxia\/image\/20191011\/e78db85e93d9251252d893af1c0fb85b.png","buyLimit":20},{"id":28,"goodsName":"\u751c\u725b\u5976.","packageFlag":"N","standardPrice":1000,"category":"default","desc":"12oz\u751c\u725b\u59761\u676f","status":0,"isRecommend":0,"imageUrl":"https:\/\/img.xianxiapai.net\/longxia\/image\/20191011\/bee6797a2376798103ef349fbfce7340.png","buyLimit":20},{"id":29,"goodsName":"\u5927\u676f\u6c7d\u6c34","packageFlag":"N","standardPrice":1000,"category":"default","desc":"22oz\u5927\u676f\u53ef\u4e501\u676f","status":0,"isRecommend":0,"imageUrl":"https:\/\/img.xianxiapai.net\/longxia\/image\/20191011\/0e349f751215c060aae930c1d77b8b68.png","buyLimit":20}]},{"id":"package","name":"\u5957\u9910","child":[{"id":101,"goodsName":"101","packageFlag":"Y","standardPrice":2400,"category":"default","desc":"16oz\u4e2d\u676f\u53ef\u4e501\u676f+46oz\u4e2d\u4efd\u7206\u7c73\u82b11\u4efd","status":0,"isRecommend":1,"imageUrl":"https:\/\/img.xianxiapai.net\/longxia\/image\/20191011\/5f2940fb0c363e843f5f28fc1f580f54.jpg","buyLimit":20},{"id":102,"goodsName":"102","packageFlag":"Y","standardPrice":2400,"category":"default","desc":"16oz\u4e2d\u676f\u53ef\u4e501\u676f+46oz\u4e2d\u4efd\u7206\u7c73\u82b11\u4efd","status":0,"isRecommend":0,"imageUrl":"https:\/\/img.xianxiapai.net\/longxia\/image\/20191011\/5f2940fb0c363e843f5f28fc1f580f54.jpg","buyLimit":20}]},{"id":"singer","name":"\u5355\u54c1","child":[{"id":103,"goodsName":"103","packageFlag":"Y","standardPrice":2400,"category":"default","desc":"16oz\u4e2d\u676f\u53ef\u4e501\u676f+46oz\u4e2d\u4efd\u7206\u7c73\u82b11\u4efd","status":0,"isRecommend":1,"imageUrl":"https:\/\/img.xianxiapai.net\/longxia\/image\/20191011\/5f2940fb0c363e843f5f28fc1f580f54.jpg","buyLimit":20},{"id":104,"goodsName":"104","packageFlag":"Y","standardPrice":2400,"category":"default","desc":"16oz\u4e2d\u676f\u53ef\u4e501\u676f+46oz\u4e2d\u4efd\u7206\u7c73\u82b11\u4efd","status":0,"isRecommend":0,"imageUrl":"https:\/\/img.xianxiapai.net\/longxia\/image\/20191011\/5f2940fb0c363e843f5f28fc1f580f54.jpg","buyLimit":20}]}]
      const list = Array.prototype.concat.apply([],data.goodsTree.map(item => {
        return item.child.filter(i => i.isRecommend > 0)
      }))
      const finalData = data.goodsTree.map(item => {
        return {...item, child: item.child.map(i => {
          return {...i, count: 0}
        })}
      })
      console.log(data)
      this.setState({
        goodsBanner: data.goodsBanner,
        goodsList: finalData,
        valueList: list.map(item => {
          return {...item, count: 0}
        })
      }, () => {
        Taro.createSelectorQuery().select('#goodsList').boundingClientRect((rects) => {
          const height = Taro.getSystemInfoSync().windowHeight - rects['top']
          this.setState({
            listHeight: height
          })
          for (let i = this.state.goodsList.length - 1; i >= 0; i --) {
            Taro.createSelectorQuery().select(`#id${i}`).boundingClientRect((rect) => {
              topList.unshift(rect['top'] - rects['top'])
              console.log(rect['top'] - rects['top'])
            }).exec()
          }
        }).exec()
      })
    }
  }

  change(item:any,newCount:number,addOrNot:number) {
    newCount > 0 ? track('sale_goods_add') : track('sale_goods_cut')
    let newArray = this.state.goodsList
    let newArray2 = this.state.valueList
    console.log(item.id)
    newArray.map(items => {
      let has = items.child.find(i => i.id === item.id)
      if (has) has.count = newCount
    })
    let has = newArray2.find(items => items.id === item.id)
    if (has) has.count = newCount
    this.setState(pre => ({
      goodsList: newArray,
      valueList: newArray2,
      count: pre.count + addOrNot,
      total: (pre.total*100 + addOrNot*item.standardPrice)/100,
      selectList: Array.prototype.concat.apply([],newArray.map(item => {
        return item.child.filter(i => i.count > 0)
      }))
    }),() => {
      this.state.count === 0 && this.toggleSelected()
    })
  }

  toggleSelected() {
    if (!this.state.selectedShow && !this.state.count) return
    this.setState(pre => ({
      selectedShow: !pre.selectedShow
    }))
  }

  cart() {
    track('sale_cart')
    this.toggleSelected()
  }

  chooseType(index) {
    console.log(index)
    this.setState({
      typeIndex: -1,
      scrollIndex: index,
    },()=>{
      this.setState({
        typeIndex: index
      })
    })
  }

  scrolling(e) {
    for (let i = 0; i < topList.length - 1; i ++) {
      if (e.detail.scrollTop < topList[i + 1] - 50 && e.detail.scrollTop > topList[i]) {
        this.setState({
          scrollIndex: i
        })
        break
      }
    }
  }

  render () {
    const { goodsList, selectedShow, count, total, goodsBanner, valueList, typeIndex, listHeight, scrollIndex, selectList} = this.state
    return (
      <Report>
        <View className='sale'>
          {
            goodsBanner.length > 0 &&
            <Swiper
              className="bigBanner"
              previousMargin='20rpx'
              nextMargin='20rpx'
            >
              {
                goodsBanner.map((item,index) => {
                  return (
                    <Block key={index}>
                    <SwiperItem className="slide" onClick={this.bannerTo.bind(this,item)}>
                      <View className="box">
                        <Image src={item.image} className="slide-image"/>
                      </View>
                    </SwiperItem>
                    </Block>
                  )
                })
              }
            </Swiper>
          }
          {
            valueList.length > 0 &&
            <View className="valueMeal">
              <View className="name">超值套餐</View>
              <ScrollView className="scroll" scrollX={true}>
                <View className="scrollBox">
                {
                  valueList.map((item,index) => {
                    return (
                      <Snack vertical={true} preview={true} info={item} key={index} onChangeNum={this.change.bind(this)}></Snack>
                    )
                  })
                }
                </View>
              </ScrollView>
            </View>
          }
          {
            goodsList.length > 0&&
            <View className="goodLists" id='goodsList'>
              <ScrollView className="goodsName" scrollY style={`height:${listHeight}px`}>
                {
                  goodsList.map((items,index) => {
                    return(
                      <View className={`name flex ${scrollIndex===index && 'on'}`} key={index} onClick={this.chooseType.bind(this, index)}>{items.name}</View>
                    )
                  })
                }
                <View className="goodsBottom"></View>
              </ScrollView>
              <ScrollView className="goods" scrollWithAnimation={true} scrollY scrollIntoView={`id${typeIndex}`} style={`height:${listHeight}px`} onScroll={this.scrolling}>
                {
                  goodsList.map((items,indexs) => {
                    return(
                      <View className="goodsItem" key={indexs} id={`id${indexs}`}>
                        {
                          indexs === 0 &&
                          <View className="topic">
                            <Text>选购小食</Text>
                            <Text className="gray">边吃边看最爽啦</Text>
                          </View>
                        }
                        {
                          items.child.length > 0 && 
                          items.child.map((item,index) => {
                            return (
                              <Snack sale={true} preview={true} info={item} key={index} onChangeNum={this.change.bind(this)}></Snack>
                            )
                          })
                        }
                      </View>
                    )
                  })
                }
                <View className="goodsBottom" style={`height: ${listHeight/3*2}px`}></View>
              </ScrollView>
            </View>
          }
          {
            selectedShow &&
            <View className="selected">
              <View className="bg" onClick={this.toggleSelected}></View>
              <View className="detail">
                <View className="title flex">
                  已选商品
                  <View className="close flex" onClick={this.toggleSelected}>收回</View>
                </View>
                <ScrollView className="selectedList" scroll-y>
                  {
                    selectList.map((item,index) => {
                      return (
                        <Block key={index}>
                          {
                            item.count && 
                            <View className="select">
                              <View className="info">
                                <View className="topic">{item.goodsName}</View>
                                <View className="description">{item.desc}</View>
                              </View>
                              <Cumulation info={item} onChangeNum={this.change.bind(this)}></Cumulation>
                            </View>
                          }
                        </Block>
                      )
                    })
                  }
                </ScrollView>
              </View>
            </View>
          }
          {
            count &&
            <View className="bottom">
              <View className={`shop ${count ? '':'gray'}`} onClick={this.cart}>
                {
                  count &&
                  <View className="num flex">{count}</View>
                }
              </View>
              <View className="total">总计<Text>￥{total}</Text></View>
              <View className="btn flex" onClick={this.toOrder}>结算</View>
            </View>
          }
        </View>
      </Report>
    )
  }

  bannerTo(page:any) {
    goSomewhere(page)
  }

  toOrder() {
    if (!this.state.count) return
    track('sale_order')
    this.props.saveSnack(this.state.selectList)
    Taro.navigateTo({
      url: `/pages/order/order?type=snack`
    })
  }
}

export default SalePage