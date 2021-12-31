import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Block, Swiper, SwiperItem, Button } from '@tarojs/components';
import './index.less'
import { FilmsData } from '../../store/movies/interface';
import { getHome, postAccept, postShareCoupon } from '../../api/index';
import { bannerData } from 'src/store/interface';
import Api from '../../api/request';
import MovieImg from '../../components/movieImg/index';
import Report from '../../components/reportSubmit/index';
import { goSomewhere } from '../../utils/common';
import Collect from '../../components/collect/index';
import { track } from '../../utils/track';
import IndexModal from '../../components/indexModal/index';
interface indexState {
  movies: FilmsData[],
  bigBanners: bannerData[],
  smallBanners: bannerData[],
  loaded: boolean,
  cinema: any,
  popup: any,
  newRP: number,
  myShowModal: boolean,
}

let clickShare, leaveTime = 0;

export default class Index extends Component<{}, indexState> {
  config: Config = {
    navigationBarTitleText: '首页',
    enablePullDownRefresh: true,
  }
  constructor() {
    super(...arguments)
    this.state = {
      myShowModal: false,
      cinema: {},
      movies: [],
      bigBanners: [],
      smallBanners: [],
      loaded: false,
      popup: {},
      newRP: 0,
    }
  }

  componentWillMount() { }

  async componentDidMount() {
    await Api.login()
    track('index_enter')
    this.getHome(true)
  }

  onPullDownRefresh() {
    this.getHome()
    Taro.stopPullDownRefresh()
  }

  componentWillUnmount() { }

  componentDidShow() {
    if (Taro.getStorageSync('lastPage') === 'auth' && this.$router.params.give_coupon) {
      Taro.setStorageSync('lastPage', '')
      this.postAccept()
    } else if (Taro.getStorageSync('lastPage') === 'auth') {
      this.getHome()
    }
    // 分享回来检查时间
    if (clickShare === 2) {
      if (leaveTime > 3) {
        this.setState({
          newRP: 2
        })
      } else {
        this.setState({
          myShowModal: true
        })
      }
      clickShare = 0
      leaveTime = 0
    }
  }

  componentDidHide() {
    if (clickShare) {
      clickShare = 2
      this.countingLeave()
    }
  }

  onShareAppMessage(res) {
    let shareInfo = {
      title: `${this.state.cinema.cinemaName}官方小程序`,
      imageUrl: '',
      path: '/pages/index/index'
    };
    if (res.from === 'button') {
      shareInfo = {
        title: '来这看电影最便宜，还能领20元红包',
        imageUrl: 'https://img.xianxiapai.net/saas/rpShare.png',
        path: '/pages/index/index?sourceFrom=rp'
      }
    }
    return shareInfo
  }

  async getHome(fromOnLoad?) {
    const { data, status } = await getHome(fromOnLoad && this.$router.params.give_coupon, this.$router.params.page)
    console.log(data)
    if (status) {
      this.checkCoupon(data)
      this.setState({
        movies: data.films,
        smallBanners: data.smallBanners,
        bigBanners: data.bigBanners,
        cinema: data.cinema,
        popup: (fromOnLoad && data.give_coupon) || data.popup,
      })
      Taro.setNavigationBarTitle({
        title: data.cinema.cinemaName
      })
      Taro.setStorageSync('cinema', data.cinema.cinemaName)
      Taro.setStorageSync('app', `${data.cinema.appName}|${data.cinema.logo}`)
      // Taro.setStorageSync('app', `德信影城|https://img.xianxiapai.net/saas/shareImg.jpeg`)
      fromOnLoad && this.$router.params.page && this.directTo()
      data.popup && track(`index_popshow_${data.popup.id}`)
      if (data.other_promo.length > 0) {
        track('index_new')
        data.other_promo.map(item => {
          this.setState({
            newRP: item === 'share_coupon_double' ? 1 : 0
          })
        })
      }
    }
  }

  // 方能跳转
  // ============================================================================================================
  directTo() {
    const params = this.$router.params
    let url = `${this.$router.params.page}?`
    for (let item in params) {
      if (item !== 'page') {
        url += `${item}=${params[item]}&`
      }
    }
    url.slice(0, -1)
    const tab = ['index', 'sale', 'user'];
    if (tab.indexOf(params.page.split('/')[3]) > -1) {
      Taro.switchTab({
        url: url
      })
    } else {
      Taro.navigateTo({
        url: url
      })
    }
  }

  // 好友赠票
  // ============================================================================================================
  checkCoupon(data) {
    if (data.give_coupon && data.give_coupon.is_mine) {
      Taro.showModal({
        title: '',
        content: '你不能领取自己送出的亲友票哦',
        confirmText: '知道了',
        showCancel: false
      })
    } else if (data.give_coupon && data.give_coupon.is_give) {
      if (data.give_coupon.is_give_mine) {
        Taro.showModal({
          title: '',
          content: '你已领取过，请勿重复领取',
          confirmText: '知道了',
          showCancel: false
        })
      } else {
        Taro.showModal({
          title: '',
          content: '你来晚啦！票已被别人领取啦',
          confirmText: '知道啦',
          showCancel: false
        })
      }
    }
  }

  async postAccept() {
    const { ret, status, data, message } = await postAccept(this.$router.params.give_coupon)
    if (ret) {
      Taro.showModal({
        title: '',
        content: '免费亲友票领取成功',
        confirmText: '立即查看',
        showCancel: false
      }).then(res => {
        res.confirm && Taro.navigateTo({
          url: `/pages/coupons/coupons?showTips=true`
        })
      })
    } else {
      Taro.showModal({
        title: '领取失败',
        content: message,
        confirmText: '知道啦'
      })
    }
  }

  async receive() {
    if (!Taro.getStorageSync('token')) {
      Taro.navigateTo({
        url: `/pages/authMobile/authMobile?toCoupons=true`
      })
    } else {
      this.postAccept()
    }
    this.closePop()
  }

  closePop() {
    this.setState({
      popup: {}
    })
  }

  // 新人红包
  // ============================================================================================================

  async getRP(action, notShare?) {
    if (notShare === 'notShare') {
      track('index_new_get')
    } else {
      action === 'success' ? track('index_new_getdouble') : track('index_new_getsingle')
    }
    await postShareCoupon(action)
    this.setState({
      newRP: 0
    })
    Taro.showToast({
      title: '领取成功，购票时自动抵扣',
      icon: 'none'
    })
  }

  countingLeave() {
    if (!clickShare) return
    leaveTime++;
    setTimeout(() => {
      this.countingLeave()
    }, 1000);
  }

  closeRP() {
    this.setState({
      newRP: 0
    })
  }

  closeModal() {
    this.setState({
      myShowModal: false
    })
  }

  startClick() {
    clickShare = 1
  }

  render() {
    const { movies, bigBanners, smallBanners, loaded, cinema, popup, newRP, myShowModal } = this.state
    return (
      <Report>
        <View className='body'>
          {
            bigBanners.length > 0 &&
            <Swiper
              className="bigBanner"
              previousMargin='20rpx'
              nextMargin='20rpx'
              circular={true}
              interval={3000}
              autoplay={true}
            >
              {
                bigBanners.map((item, index) => {
                  return (
                    <Block key={index}>
                      <SwiperItem className="slide" onClick={this.bannerTo.bind(this, item)}>
                        <View className="box">
                          <Image src={item.image} className="slide-image" />
                        </View>
                      </SwiperItem>
                    </Block>
                  )
                })
              }
            </Swiper>
          }
          {
            smallBanners.length > 0 &&
            <View className={loaded ? "smallBanner loaded" : "smallBanner"} onClick={this.bannerTo.bind(this, smallBanners[0])}>
              <Image src={smallBanners[0].image} mode="widthFix" onLoad={() => {
                this.setState({
                  loaded: true
                })
              }} />
            </View>
          }
          <View className="movies">
            {
              movies && movies.map((item, index) => {
                return (
                  <View className="moviebox" key={index} onClick={this.toMovie.bind(this, item.id)}>
                    <View className="movie_img">
                      <MovieImg url={item.imageUrl}></MovieImg>
                    </View>
                    <View className="movie_information">
                      <View className="movie_leftbox">
                        <View className="movie_title">{item.name}</View>
                        <View className="movie_type">{item.summary}</View>
                        <View className="movie_director">导演：{item.director}</View>
                        <View className="movie_starring">主演：{item.starring}</View>
                      </View>
                      <View className="btn">
                        {
                          item.saleStatus === 1 ?
                            <View className="movie_btn">购票</View>
                            : item.saleStatus === 2 ?
                              <View className="movie_btn pre">预售</View>
                              :
                              <Block></Block>
                        }
                        {
                          item.price &&
                          <View className="movie_price">会员{item.price / 100}元起</View>
                        }
                      </View>
                    </View>
                  </View>
                )
              })
            }
          </View>
          <IndexModal
            popup={popup}
            newRP={newRP}
            myShowModal={myShowModal}
            closeModal={this.closeModal.bind(this)}
            startClick={this.startClick.bind(this)}
            closePop={this.closePop.bind(this)}
            receive={this.receive.bind(this)}
            getRP={this.getRP.bind(this)}
            closeRP={this.closeRP.bind(this)}
          ></IndexModal>
          <Collect fromIndex={true}></Collect>
        </View>
      </Report>
    )
  }

  bannerTo(page: any) {
    track(`index_banner_${page.id}`)
    goSomewhere(page)
  }

  toMovie(filmId: number) {
    track('index_movies')
    Taro.navigateTo({
      url: `/pages/movies/movies?filmId=${filmId}`
    })
  }
}

