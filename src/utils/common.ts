import Taro from '@tarojs/taro'

export const showLoading = () => {
  Taro.showLoading({
    title: '加载中',
    mask: true
  })
}

export const hideLoading = () => {
  Taro.hideLoading()
}

export const fixFloatNumber = (a:any,b:any) => {
  let c:number, d:number, m:number
  try {
      c = a.toString().split(".")[1].length
  } catch(e) {
      c = 0
  }
  try {
      d = b.toString().split(".")[1].length
  } catch(e) {
      d = 0
  }
  m = Math.pow(10, Math.max(c, d))
  return(Number(Number(a * m).toFixed(0)) + Number(Number(b * m).toFixed(0))) / m
}

export const timeCalculator = (time:string, duration?:number) => {
  if (!duration) return `${time.split(':')[0]}:${time.split(':')[1]}`
  let resH = Number(time.split(':')[0]) + Math.floor(duration/60)
  let resM = Number(time.split(':')[0]) + Math.floor(duration%60)
  resH = resH > 23 ? resH - 24 : resH
  return `${toDouble(resH)}:${toDouble(resM)}`
}

export const toDouble = (n:number) => {
  return n < 10 ? `0${n}` : n 
}

export const dateToNowadays = (date:string) => {
  const week = ['周日','周一','周二','周三','周四','周五','周六']

  let td=new Date();
  td=new Date(td.getFullYear(),td.getMonth(),td.getDate());
  let od=new Date(date);
  od=new Date(od.getFullYear(),od.getMonth(),od.getDate());
  let xc=(Number(od) - Number(td))/1000/60/60/24;
  if (xc==0) {
    return `今天`;
  } else if (xc>0 && xc<2){
    return `明天`;
  } else {
    return `${week[od.getDay()]}`;
  }
}

export const removeYear = (date:string) => {
  return `${date.split('-')[1]}-${date.split('-')[2]}`
}

// 倒计时
export const secondToTime = (num:number,hasH?) => {
  let h,m,s;
  h = toDouble(Math.floor(num / 3600));
  m = toDouble(Math.floor(num / 60) % 60);
  s = toDouble(num % 60);
  return hasH ? `${h}:${m}:${s}` : `${m}:${s}`
}

export const rpx2px = (rpx:number) => {
  return rpx / 750 * Taro.getSystemInfoSync().windowWidth; 
}


export const goSomewhere = (url) => {
  let page = url.page || url.href
  console.log(page)
  if ( url.jump_type === 'miniapp' ) {
    Taro.navigateToMiniProgram( {
      appId: url.app_id,
      path: page,
    } );
  } else if ( url.jump_type === 'pages' ) {
    var tab = ['index', 'sale', 'user'];
    if ( tab.indexOf( page.split( '/' )[2] ) > -1 ) {
      Taro.switchTab( {
        url: page
      } );
    } else {
      Taro.navigateTo( {
        url: page
      } );
    }
  } else if ( url.jump_type === 'h5' ) {
    Taro.navigateTo({
      url: `/pages/webview/webview?url=${page}`
    })
  }
}