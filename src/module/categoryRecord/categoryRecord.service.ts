import { Model } from 'mongoose';
import * as moment from 'moment'
import { Inject, Injectable } from '@nestjs/common';
import { ICategoryRecord } from './categoryRecord.interfaces';
import { RedisService } from 'nestjs-redis';
import { CreateCategoryRecordDTO } from './categoryRecord.dto';

@Injectable()
export class CategoryRecordService {
  constructor(
    @Inject('CategoryRecordModelToken') private readonly categoryRecordModel: Model<ICategoryRecord>,
    private readonly redis: RedisService,
  ) { }

  // 根据订单生成记录
  async genRecord(id: string, price: number, count: number, layer: number) {
    const client = this.redis.getClient()
    const exist = await client.hget(`categoryRecordSale_${layer}`, String(id))
    if (exist) {
      await client.hset(`categoryRecordSale_${layer}`, String(id), (Number(exist) + price).toFixed(2))
    } else {
      await client.hset(`categoryRecordSale_${layer}`, String(id), price.toFixed(2))
    }
    await client.hincrby(`categoryRecordCount_${layer}`, String(id), count)
    return
  }

  // 生成当天数据
  async genLog() {
    const client = this.redis.getClient()
    const categories = await client.hkeys('categoryRecordSale_1')
    const day = moment().add(-1, 'd').format('YYYY-MM-DD')
    const month = moment().add(-1, 'd').format('YYYY-MM-DD')
    const year = moment().add(-1, 'd').format('YYYY-MM-DD')
    await Promise.all(categories.map(async category => {
      const sale = Number(await client.hget('categoryRecordSale_1', category))
      const count = Number(await client.hget('categoryRecordCount_1', category))
      const preLog: ICategoryRecord | null = await this.categoryRecordModel.findOne({ newRecord: true, category })
      const log: CreateCategoryRecordDTO = {
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
        layer: 1,
        category,
      }
      if (preLog) {
        await this.categoryRecordModel.findByIdAndUpdate(preLog._id, { newRecord: false })
      }
      return await this.categoryRecordModel.create(log);
    }))
    await client.del('categoryRecordSale_1')
    await client.del('categoryRecordCount_1')
    await client.del('categoryRecordSale_2')
    await client.del('categoryRecordCount_2')
    return
  }

  // 获取销售额类别占比
  async getRadar() {
    let other = 0
    const datas: any[] = []
    const categoryRecords = await this.categoryRecordModel.find({ newRecord: true }).sort({ sale: -1 }).populate({ path: 'category', model: 'category' }).lean().exec()
    categoryRecords.map((categoryRecord, index) => {
      if (index < 6 && categoryRecord.category) {
        return datas.push({ ...categoryRecord, category: categoryRecord.category.name })
      }
      other += categoryRecord.sale
    })
    if (other > 0) {
      datas.push({ category: '其他', sale: other })
    }
    return datas
  }
}