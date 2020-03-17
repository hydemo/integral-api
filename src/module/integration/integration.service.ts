import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { ApiErrorCode } from '@common/enum/api-error-code.enum';
import { ApiException } from '@common/expection/api.exception';
import { Pagination } from 'src/common/dto/pagination.dto';
import { PaginationUtil } from 'src/utils/pagination.util';
import { IList } from 'src/common/interface/list.interface';
import { CreateIntegrationDTO } from './integration.dto';
import { IIntegration } from './integration.interfaces';
import { UserService } from '../user/user.service';

@Injectable()
export class IntegrationService {
  constructor(
    @Inject('IntegrationModelToken') private readonly integrationModel: Model<IIntegration>,
    @Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
    @Inject(UserService) private readonly userService: UserService,
  ) { }

  // 创建数据
  async create(integration: CreateIntegrationDTO): Promise<IIntegration | null> {
    if (integration.count < 0) {
      throw new ApiException('参数有误', ApiErrorCode.INPUT_ERROR, 406)
    }
    const count = parseInt(String(integration.count))
    if (count <= 0) {
      return null
    }
    if (integration.type === 'add') {
      await this.userService.incIntegration(integration.user, count)
    } else {
      await this.userService.incIntegration(integration.user, -count)
    }
    return await this.integrationModel.create({ ...integration, count })
  }

  // 分页查询数据
  async list(pagination: Pagination): Promise<IList<IIntegration>> {
    const condition = this.paginationUtil.genCondition(pagination, []);
    const list = await this.integrationModel
      .find(condition)
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    const total = await this.integrationModel.countDocuments(condition);
    return { list, total };
  }

  // 退回
  async refund(integration: CreateIntegrationDTO): Promise<IIntegration | null> {
    if (integration.count <= 0) {
      throw new ApiException('参数有误', ApiErrorCode.INPUT_ERROR, 406)
    }
    const count = parseInt(String(integration.count))
    if (count <= 0) {
      return null
    }
    if (integration.type === 'add') {
      await this.userService.refundIntegration(integration.user, count)
    } else {
      await this.userService.refundIntegration(integration.user, -count)
    }
    return await this.integrationModel.create({ ...integration, count })
  }
}