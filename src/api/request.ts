import Taro from '@tarojs/taro';
import { showLoading, hideLoading } from '../utils/common';
import { getLoginInfo } from './index';
import { globalData } from '../app';

class api{
  
  async login(force?:Boolean) {
    if (Taro.getStorageSync('token') && !force) return
    const {code} = await Taro.login()
    const {data} = await getLoginInfo(code)
    Taro.setStorageSync('token',data.userToken || '')
  }

  host = 'https://saas.xianxiapai.cn'
  // host = 'http://yapi.yinge.co/mock/25'
  
  async request(url:String, method?:"GET" | "POST", params = {}){
    const host = 'https://saas.xianxiapai.cn'
    // host = 'http://yapi.yinge.co/mock/25'
    const unShown = ['collect/formid', 'trade/detail', '/luckydraw/draw', 'promo/scan-ticket/result', 'scan-ticket/start']

    let dontShow = unShown.find(item => url.includes(item))
    !dontShow&&showLoading()
    let newParams = {}
    params && Object.keys(params).map((item) => {
      if (params[item]) {
        newParams[item] = params[item];
      }
    })
    if (!Taro.getStorageSync('cinemaId')) {
      await this.getCinemaId()
    }
    const res = await Taro.request({
      url: `${host}${url}`,
      method: method,
      header: {
        'cinemaId': Taro.getStorageSync('cinemaId'),
        'Authorization': `Bearer ${Taro.getStorageSync('token')}`,
        // 'Authorization': `Bearer eyJpdiI6IlQ0QXlaV2dVK1B1RnE5RVwvOFdVTmtnPT0iLCJ2YWx1ZSI6Im5oQmZUZ1d6VDBDd2g4WjBJcTV4U3c9PSIsIm1hYyI6IjBiNzBlYTVlYWM3NTMwMTQwZjIzZTI2MTNhNTRlOWNlOTJiZGEzYmRlYTZiMGQxN2E1MmQxZDBkZjc5N2NjM2YifQ==`,
        'sourceFrom': globalData.sourceFrom || ''
      },
      data: newParams
    })  
    !dontShow&&hideLoading()
    res.data.status === 401 && this.toAuth()
    // 状态码
    switch (res.statusCode) {
      case 200:
        return this.successCallBack(res)
        break
      // case 401:
      //   this.toAuth()
      //   break
    }
  }

  async successCallBack(res:any){
    const notToast = [10000, 10001]
    if (res.data.status!==1&&res.data.message&&!notToast.some(item => item === res.data.status)) {
      return Promise.reject(Taro.showToast({title:res.data.message,icon:'none'}))
    }
    return res.data
  }

  async getCinemaId() {
    return new Promise(async (res,rej) => {
      const {data} = await Taro.request({
        url: `${this.host}/miniapp/cinema/index`
      })
      console.log(data)
      await Taro.setStorage({key:'cinemaId',data:data.data.cinemas[0].id})
      res()
    })
  }

  toAuth() {
    Taro.navigateTo({
      url: `/pages/authMobile/authMobile`
    })
  }
}

const Api = new api();
export default Api;