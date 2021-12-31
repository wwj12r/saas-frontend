export interface FilmsData {
  dimensional: string;
  director: string;
  duration: number;
  id: number;
  imageUrl: string;
  language: string;
  name: string;
  score: string;
  shortName: string;
  starring: string;
  summary: string;
  type: string;
  isReminded?: string;
  isCommented?: string;
  dateSchedules: dateSchedules[];
  saleStatus: number;
  price: number;
}

export interface dateSchedules {
  date: string;
  shows: shows[];
}

export interface shows {
  showVersion: string;
  endTime: string;
  hallId: number;
  hallName: string;
  id: number;
  seatVersion: string;
  sellPrice: number;
  showDate: string;
  showTime: string;
  standardPrice: string;
  member: {
    price: number
  };
  prices: {
    code: number,
    price: number,
  }[];
}

export interface CinemaData {
  cinemaName: string;
  address: string;
  city: string;
  id: number;
  tags: string;
  maxTicketNum: number,
}

export interface IconsData {
  code: number,
  icon: string,
  name: string,
}

export interface ticketData {
  buyAt: string,
  showDateTime: string,
  countDesc: string,
  hallName: string,
  imageUrl: string,
  name: string,
  orderId: number,
  summary: string,
  ticketStatus: number,
  showVersion?:string,
  duration?:number,
}

export interface orderData {
  amount: number,
  buyAt: string,
  cinemaId: number,
  count: number,
  countdown: number,
  expiredAt: number,
  goodsCount: number,
  id: number,
  orderNo: string,
  printCode: string,
  qrcode: string,
  remark: string,
  scheduleId: number,
  seatIds: string,
  seatNames: string[],
  ticketStatus: number,
  title: string,
}

export interface couponData {
  amount: number,
  coupon_type: number,
  end_at: string,
  id: number,
  subtitle: string,
  title: string,
  to_type: number,
}

export interface selectedPost {
  orderId?: any,
  goods?: any[],
  ticketCoupons?: any,
  goodsCoupons?: any,
  depositCard?: any,
  benefitCard?: any
}

export interface cardsData {
  depositCard?: any,
  benefitCard?: any
}