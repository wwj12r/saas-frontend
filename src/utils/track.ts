import Taro from '@tarojs/taro'

export const track = ( action, params? ) => {
  Taro.getApp().aldstat.sendEvent(action,params)
}