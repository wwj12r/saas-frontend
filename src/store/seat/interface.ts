export interface HallData {
  cinemaId: number;
  cinemaLinkId: string;
  hallCode: string;
  hallName: string;
  hallType: string;
  id: number;
  seatCount: number;
}

export interface ScheduleData {
  id: number;
  seatVersion: string;
  sellPrice: number;
  showDate: string;
  showTime: string;
  standardPrice: string;
  showVersion: string;
  endTime: string;
  hallName: string;
}

export interface SectionsData {
  id: number;
  rowCount: number;
  columnCount: number;
  sectionCode: string;
  sectionName: string;
  seats: SeatsData[]
}

export interface SeatsData {
  rowNum: number;
  rowId: string;
  columns: SeatData[]
}

export interface SeatData {
  columnId?: string;
  damaged?: string;
  id?: number;
  name?: string;
  price?: string;
  rowId?: string;
  seatCode?: string;
  sectionId?: number;
  status: number;
  type?: string;
  y: number;
  x: number;
  areaId: number,
  cardPriceInfo?:priceData
}

export interface SeatTypes {
  icon: string,
  name: string,
  type: number,
}

export interface priceData {
  areaId: number,
  areaName: string,
  price: number,
  serviceFee: number,
  benefit_sell_price: number,
}

export interface benefitData {
  type: 'deposit'|'benefit'|'standard'|'coupon',
  buyLimit: number,
  prices: priceData[]
}