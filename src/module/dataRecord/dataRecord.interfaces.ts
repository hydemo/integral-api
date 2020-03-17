import { Document } from 'mongoose';


export interface IDataRecord {
  // 日期
  readonly day: string;
  // 月份
  readonly month: string;
  // 年份
  readonly year: string;
  // 销售额
  readonly sale: number;
  // 总销售额
  readonly saleTotal: number;
  // 访问量
  readonly viewCount: number;
  // 总访问量
  readonly viewCountTotal: number;
  // 用户
  readonly users: number;
  // 总用户
  readonly usersTotal: number;
  // 购买用户
  readonly buyUsers: number;
  // 总购买用户
  readonly buyUsersTotal: number;
  // 分类
  readonly categories: number;
  // 总分类
  readonly categoriesTotal: number;
  // 商品
  readonly goods: number;
  // 总商品
  readonly goodsTotal: number;
  // 订单
  readonly orders: number;
  // 总订单
  readonly ordersTotal: number;
  // 待发货订单
  readonly orderToSend: number;
  // 已处理订单
  readonly orderSended: number;
}
