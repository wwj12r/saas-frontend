import Api from "./request";
// 登录
export const getLoginInfo = async (code: String) => {
  return await Api.request(`/miniapp/auth/login?code=${code}`)
}

export const postUserInfo = async (code:String,iv:String,encryptedData:String) => {
  return await Api.request(`/miniapp/auth/userinfo`,'POST',{code,iv,encryptedData})
}

export const getFormId = async (formid:string|number) => {
  return await Api.request(`/miniapp/collect/formid?formid=${formid}`)
}

export const postUserMobile = async (code:String,iv:String,encryptedData:String) => {
  return await Api.request(`/miniapp/auth/mobile`,'POST',{code,iv,encryptedData})
}

export const getHome = async (give_coupon?:string, page?: string) => {
  return await Api.request(`/miniapp/home`,'GET',{give_coupon, page})
}

export const getUser = async () => {
  return await Api.request(`/miniapp/user/home`)
}

export const getGoods = async () => {
  return await Api.request(`/miniapp/goods/home`)
}

export const getMovies = async () => {
  return await Api.request(`/miniapp/cinema/schedule`)
}

export const getSeats = async (scheduleId:string) => {
  return await Api.request(`/miniapp/seat/map?scheduleId=${scheduleId}`)
}

export const OrderBuy = async (scheduleId:number,seats:any) => {
  return await Api.request(`/miniapp/order/buy`,'POST',{scheduleId,seats})
}

export const getCards = async () => {
  return await Api.request(`/miniapp/card/map`)
}

export const getCardInfo = async (cardruleId:string|number,cardruleType:string) => {
  return await Api.request(`/miniapp/card/detail?cardruleId=${cardruleId}&cardruleType=${cardruleType}`)
}

export const cardPreopen = async (cardRuleId:number|string,amount:number,cardRuleType:string,password?:string) => {
  return await Api.request(`/miniapp/card/preopen`,'POST',{cardRuleId,amount,password,cardRuleType})
}

export const cardBind = async (cardNo:number|string,password:string) => {
  return await Api.request(`/miniapp/card/bind`,'POST',{cardNo,password})
}

export const getTickets = async () => {
  return await Api.request(`/miniapp/user/tickets`)
}

export const getSnacks = async () => {
  return await Api.request(`/miniapp/goods/tickets`)
}

export const getCoupons = async () => {
  return await Api.request(`/miniapp/coupon/map`)
}

export const getOrderTicket = async (id:string|number) => {
  return await Api.request(`/miniapp/order/ticket?id=${id}`)
}

export const getGoodDetail = async (id:string|number) => {
  return await Api.request(`/miniapp/goods/order/detail?orderId=${id}`)
}

export const postOrderDetail = async (orders:any) => {
  return await Api.request(`/miniapp/order/detail`,'POST',{orders})
}

export const postOrderPay = async (orders:string|number) => {
  return await Api.request(`/miniapp/order/pay`,'POST',{orders})
}

export const postGoodsBuy = async (orders:string|number) => {
  return await Api.request(`/miniapp/goods/buy`,'POST',{orders})
}

export const postGoodsDetail = async (orders:string|number) => {
  return await Api.request(`/miniapp/goods/detail`,'POST',{orders})
}

export const postGoodsPay = async (orders:any,password?:number|string) => {
  return await Api.request(`/miniapp/goods/pay`,'POST',{orders,password})
}

export const getPromoShow = async (code:string, assist_id?:string) => {
  return await Api.request(`/miniapp/promo/show?code=${code}`, 'GET', {assist_id})
}

export const getPromoSeckill = async () => {
  return await Api.request(`/miniapp/promo/show/skill`)
}

export const postPromoSeckillPay = async () => {
  return await Api.request(`/miniapp/promo/skill/pay`,'POST')
}

export const postPromoPay = async (code:string) => {
  return await Api.request(`/miniapp/promo/pay`,'POST',{code})
}

export const postAccept = async (give_coupon:string) => {
  return await Api.request(`/miniapp/usercoupon/accept`,'POST',{give_coupon})
}

export const postAssist = async (assist_id:string) => {
  return await Api.request(`/miniapp/promo/assist`,'POST',{assist_id})
}

export const getPromoShows = async (code:string) => {
  return await Api.request(`/miniapp/promo/show/multi_package?code=${code}`)
}

export const postPromosPay = async (product_id:string) => {
  return await Api.request(`/miniapp/promo/pay/multi_package`,'POST',{product_id})
}

export const getPromoGroup = async (together_id:string) => {
  return await Api.request(`/miniapp/promo/show/together`, 'GET', {together_id})
}

export const postPayGroup = async (together_id:string) => {
  return await Api.request(`/miniapp/promo/pay/together`,'POST',{together_id})
}

export const getTradeDetail = async (trade_id:string) => {
  return await Api.request(`/miniapp/trade/detail`, 'GET', {trade_id})
}

export const getLuckyShow = async (share_uid?:string,collect?: boolean) => {
  return await Api.request(`/miniapp/promo/show/lucky_draw`, 'GET', {share_uid, collect})
}

export const getLuckyList = async (page?:number) => {
  return await Api.request(`/miniapp/promo/list/lucky_draw`, 'GET', {page})
}

export const postLuckyDraw = async () => {
  return await Api.request(`/miniapp/promo/luckydraw/draw`,'POST')
}

export const getPromoScan = async () => {
  return await Api.request(`/miniapp/promo/show/scan_ticket`)
}

export const postToolsUploadToken = async () => {
  return await Api.request(`/tools/upload-token`,'POST')
}

export const postScanStart = async (imgurl:string) => {
  return await Api.request(`/miniapp/promo/scan-ticket/start`,'POST', {imgurl})
}

export const postScanResult = async (id:string) => {
  return await Api.request(`/miniapp/promo/scan-ticket/result`,'GET', {id})
}

export const getCumulativeGoods = async () => {
  return await Api.request(`/miniapp/promo/show/cumulative_goods`)
}

export const postShareCoupon = async (action:'skip'|'success') => {
  return await Api.request(`/miniapp/special-promo/share-coupon-ticket/do`,'POST', {action})
}