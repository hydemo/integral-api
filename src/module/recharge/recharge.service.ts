import { Model } from 'mongoose'
import * as  uuid from 'uuid/v4';
import { Inject, Injectable } from '@nestjs/common'
import { IRecharge } from './recharge.interfaces'
import { CreateRechargeDTO } from './recharge.dto'
import { Pagination } from 'src/common/dto/pagination.dto';
import { IList } from 'src/common/interface/list.interface';
import { RechargeDTO } from '../user/users.dto';
import { CreateUserBalanceDTO } from '../userBalance/userBalance.dto';
import { ApiException } from 'src/common/expection/api.exception';
import { ApiErrorCode } from 'src/common/enum/api-error-code.enum';
import { UserBalanceService } from '../userBalance/userBalance.service';
import { PaginationUtil } from 'src/utils/pagination.util';


@Injectable()
export class RechargeService {
  constructor(
    @Inject('RechargeModelToken') private readonly rechargeModel: Model<IRecharge>,
    @Inject(UserBalanceService) private readonly userBalanceService: UserBalanceService,
    @Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
  ) { }


  // 创建数据
  async create(recharge: CreateRechargeDTO, creator: string): Promise<boolean> {
    let count = 1
    if (recharge.count) {
      count = recharge.count
    }
    for (let i = 0; i < count; i++) {
      await this.rechargeModel.create({ ...recharge, creator, key: uuid() })
    }
    return true
  }

  // 列表
  async list(pagination: Pagination): Promise<IList<IRecharge>> {
    const condition = this.paginationUtil.genCondition(pagination, ['amount'])
    const list = await this.rechargeModel
      .find(condition)
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .populate({ path: 'merchant', model: 'merchant' })
      .populate({ path: 'useBy', model: 'user', select: '_id nickname avatar' })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    const total = await this.rechargeModel.countDocuments(condition);
    return { list, total };
  }
  // 删除数据
  async findByIdAndRemove(id: string): Promise<boolean> {
    await this.rechargeModel.findByIdAndUpdate(id, { isDelete: true, deleteTime: Date.now() })
    return true
  }
  // 修改数据
  async findByIdAndUpdate(id, recharge: CreateRechargeDTO): Promise<boolean> {
    await this.rechargeModel.findByIdAndUpdate(id, recharge)
    return true
  }
  // 恢复
  async recoverById(id: string) {
    await this.rechargeModel.findByIdAndUpdate(id, { isDelete: false, $unset: { deleteTime: 1 } });
    return;
  }

  async  recharge(recharge: RechargeDTO, user: string) {
    const card: IRecharge | null = await this.rechargeModel.findOne({ key: recharge.key, isDelete: false })
    if (!card) {
      throw new ApiException('充值码有误', ApiErrorCode.NO_EXIST, 406)
    }
    if (card.isUsed) {
      throw new ApiException('充值码已被使用', ApiErrorCode.INPUT_ERROR, 406)
    }
    const balance: CreateUserBalanceDTO = {
      amount: card.amount,
      user,
      type: 'add',
      sourceId: card._id,
      sourceType: 1,
    }
    await this.userBalanceService.create(balance)
    await this.rechargeModel.findByIdAndUpdate(card._id, { isUsed: true, useBy: user, useTime: Date.now() })
    return card.amount.toFixed(2)
  }
}