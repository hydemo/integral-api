import { Model } from 'mongoose'
import { Inject, Injectable } from '@nestjs/common'
import * as moment from 'moment'
import { IMerchant } from './merchant.interfaces'
import { CreateMerchantDTO, PayDTO } from './merchant.dto'
import { ApiErrorCode } from '@common/enum/api-error-code.enum'
import { ApiException } from '@common/expection/api.exception'
import { Pagination } from 'src/common/dto/pagination.dto';
import { IList } from 'src/common/interface/list.interface';
import { IUser } from '../user/user.interfaces';
import { CreateUserBalanceDTO } from '../userBalance/userBalance.dto';
import { UserBalanceService } from '../userBalance/userBalance.service';
import { PaginationUtil } from 'src/utils/pagination.util';
import { MerchantBillService } from '../merchantBill/merchantBill.service';
import { CreateMerchantBillDTO } from '../merchantBill/merchantBill.dto';
import { IntegrationService } from '../integration/integration.service'
import { CreateIntegrationDTO } from '../integration/integration.dto'

@Injectable()
export class MerchantService {
  constructor(
    @Inject('MerchantModelToken') private readonly merchantModel: Model<IMerchant>,
    @Inject(UserBalanceService) private readonly userBalanceService: UserBalanceService,
    @Inject(MerchantBillService) private readonly merChantBillService: MerchantBillService,
    @Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
    @Inject(IntegrationService) private readonly integrationService: IntegrationService,
  ) { }

  /**
 * 生成订单号
 */
  getOrderSn(): string {
    const length = 10
    const time = moment().format('HHmmss')
    const random = Math.floor(Math.random() * Math.pow(8, length - 1) + 1)
    const randomLenght = random.toString().length
    const fixLength = length - randomLenght
    if (fixLength > 0) {
      return `80000000${time}${'0'.repeat(fixLength)}${random}`
    }
    return `80000000${time}${random}`
  }

  // 创建数据
  async create(merchant: CreateMerchantDTO, creator: string): Promise<IMerchant> {
    return await this.merchantModel.create({ ...merchant, creator })
  }

  // 列表
  async list(pagination: Pagination): Promise<IList<IMerchant>> {
    const condition = this.paginationUtil.genCondition(pagination, ['name', 'owner', 'phone', 'address'])
    const list = await this.merchantModel
      .find(condition)
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .populate({ path: 'creator', model: 'admin', select: '_id nickname' })
      .lean()
      .exec();
    const total = await this.merchantModel.countDocuments(condition);
    return { list, total };
  }

  // 列表
  async listByUser(pagination: Pagination): Promise<IList<IMerchant>> {
    const condition = { isDelete: false, type: { $ne: 2 } }
    const list = await this.merchantModel
      .find(condition)
      .sort({ createdAt: -1 })
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .lean()
      .exec();
    const total = await this.merchantModel.countDocuments(condition);
    return { list, total };
  }
  // 删除数据
  async findByIdAndRemove(id: string): Promise<boolean> {
    await this.merchantModel.findByIdAndUpdate(id, { isDelete: true, deleteTime: Date.now() })
    return true
  }
  // 修改数据
  async findByIdAndUpdate(id, merchant: CreateMerchantDTO): Promise<boolean> {
    await this.merchantModel.findByIdAndUpdate(id, merchant)
    return true
  }
  // 恢复
  async recoverById(id: string) {
    await this.merchantModel.findByIdAndUpdate(id, { isDelete: false, $unset: { deleteTime: 1 } });
    return;
  }

  // 恢复
  async findById(id: string) {
    return await this.merchantModel.findById(id);
  }
  // 全部数据
  async all() {
    const top = await this.merchantModel.find({ type: 1, isDelete: false }).lean().exec()
    const middle = await this.merchantModel.find({ type: 2, isDelete: false }).lean().exec()
    return { top, middle }
  }

  balanceCheck(amount, balance) {
    const newAmount = Number(amount.toFixed(2))
    const newBalance = Number(balance.toFixed(2))
    if (newAmount > newBalance) {
      throw new ApiException('余额不足', ApiErrorCode.INPUT_ERROR, 406)
    }
  }

  // 支付
  async  pay(id: string, pay: PayDTO, user: IUser) {
    this.balanceCheck(pay.amount, user.balance)
    const merchant: IMerchant | null = await this.merchantModel.findById(id)
    if (!merchant) {
      throw new ApiException('商户二维码有误', ApiErrorCode.NO_EXIST, 406)
    }

    const merChantBill: CreateMerchantBillDTO = {
      merchant: id,
      amount: pay.amount,
      orderSn: this.getOrderSn()
    }
    const bill = await this.merChantBillService.create(merChantBill, user._id)
    const balance: CreateUserBalanceDTO = {
      amount: pay.amount,
      user: user._id,
      type: 'minus',
      sourceId: bill._id,
      sourceType: 2,
    }
    await this.userBalanceService.create(balance)
    const newIntegration: CreateIntegrationDTO = {
      user: user._id,
      count: pay.amount,
      type: 'add',
      sourceId: bill._id,
      sourceType: 2,
    }
    await this.integrationService.create(newIntegration)
    return true
  }
}