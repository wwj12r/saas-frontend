export interface GoodsData {
  id: number,
  cinemaId: number,
  goodsName: string,
  packageFlag: string,
  standardPrice: number,
  category: string,
  desc: string,
  imageUrl: string,
  count: number,
  buyLimit: number
}

export interface selectedGoods{
  id: number,
  count: number,
  title: string,
  desc: string,
  standardPrice: number,
}