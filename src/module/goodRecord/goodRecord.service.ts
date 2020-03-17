import { Model } from 'mongoose';
import * as moment from 'moment'
import { Inject, Injectable } from '@nestjs/common';
import { IGoodRecord } from './goodRecord.interfaces';
import { RedisService } from 'nestjs-redis';
import { CreateGoodRecordDTO } from './goodRecord.dto';
import { IOrderProduct } from '../order/order.interfaces';
import { GoodService } from '../good/good.service';
import { CategoryRecordService } from '../categoryRecord/categoryRecord.service';
import { IGood } from '../good/good.interfaces';

@Injectable()
export class GoodRecordService {
  constructor(
    @Inject('GoodRecordModelToken') private readonly goodRecordModel: Model<IGoodRecord>,
    private readonly redis: RedisService,
    private readonly goodService: GoodService,
    private readonly categoryRecordService: CategoryRecordService,
  ) { }

  // 根据订单生成记录
  async genRecord(good: string, product: IOrderProduct) {
    const goodDetail: IGood | null = await this.goodService.findById(good)
    if (!goodDetail) {
      return
    }
    const client = this.redis.getClient()
    const price = Number((product.realPrice - product.vipMinus - product.promoteMinus - product.preSaleMinus - product.discountMinus).toFixed(2))
    const exist = await client.hget('goodRecordSale', String(good))
    if (exist) {
      await client.hset('goodRecordSale', String(good), (Number(exist) + price).toFixed(2))
    } else {
      await client.hset('goodRecordSale', String(good), price.toFixed(2))
    }
    await client.hincrby('goodRecordCount', String(good), product.count)
    if (goodDetail.category) {
      if (goodDetail.category[0]) {
        await this.categoryRecordService.genRecord(goodDetail.category[0], price, product.count, 1)
      }
      if (goodDetail.category[1]) {
        await this.categoryRecordService.genRecord(goodDetail.category[0], price, product.count, 2)
      }
    }
    return
  }

  // 生成当天数据
  async genLog() {
    const client = this.redis.getClient()
    const goods = await client.hkeys('goodRecordSale')
    const day = moment().add(-1, 'd').format('YYYY-MM-DD')
    const month = moment().add(-1, 'd').format('YYYY-MM')
    const year = moment().add(-1, 'd').format('YYYY')
    await Promise.all(goods.map(async good => {
      const sale = Number(await client.hget('goodRecordSale', good))
      const count = Number(await client.hget('goodRecordCount', good))
      const preLog: IGoodRecord | null = await this.goodRecordModel.findOne({ newRecord: true, good })
      const log: CreateGoodRecordDTO = {
        // 日期
        day,
        month,
        year,
        sale,
        // 总销量
        saleTotal: preLog ? sale + preLog.saleTotal : sale,
        // 总用户数
        count,
        // 总用户数
        countTotal: preLog ? count + preLog.count : count,
        good,
      }
      if (preLog) {
        await this.goodRecordModel.findByIdAndUpdate(preLog._id, { newRecord: false })
      }
      return await this.goodRecordModel.create(log);
    }))
    await client.del('goodRecordSale')
    await client.del('goodRecordCount')
    return
  }

  // 获取排行
  async getRank() {
    const list = await this.goodRecordModel.find({ newRecord: true }).sort({ count: -1 }).limit(7).populate({ path: 'good', model: 'good' }).lean().exec()
    return list.map(li => {
      const data = {
        ...li,
        good: li.good.name
      }
      return data
    })
  }
}