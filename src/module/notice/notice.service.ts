import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { ApiErrorCode } from '@common/enum/api-error-code.enum';
import { ApiException } from '@common/expection/api.exception';
import { Pagination } from 'src/common/dto/pagination.dto';
import { PaginationUtil } from 'src/utils/pagination.util';
import { IList } from 'src/common/interface/list.interface';
import { CreateNoticeDTO, OAuthDTO } from './notice.dto';
import { INotice } from './notice.interfaces';
import { WeixinUtil } from 'src/utils/weixin.util';

@Injectable()
export class NoticeService {
	constructor(
		@Inject('NoticeModelToken') private readonly noticeModel: Model<INotice>,
		@Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
		@Inject(WeixinUtil) private readonly weixinUtil: WeixinUtil,
	) {}

	// 创建数据
	async create(
		createNoticeDTO: CreateNoticeDTO,
		user: string,
	): Promise<INotice> {
		return await this.noticeModel.create({
			...createNoticeDTO,
			createBy: user,
		});
	}

	// 分页查询数据
	async list(pagination: Pagination): Promise<IList<INotice>> {
		const condition = this.paginationUtil.genCondition(pagination, []);
		const list = await this.noticeModel
			.find(condition)
			.limit(pagination.pageSize)
			.skip((pagination.current - 1) * pagination.pageSize)
			.populate({ path: 'createBy', model: 'admin' })
			.sort({ createdAt: -1 })
			.lean()
			.exec();
		const total = await this.noticeModel.countDocuments(condition);
		return { list, total };
	}

	// 修改数据
	async update(
		id: string,
		createNoticeDTO: CreateNoticeDTO,
	): Promise<INotice | null> {
		return await this.noticeModel.findByIdAndUpdate(id, createNoticeDTO);
	}

	// 详情
	async detail(id: string): Promise<INotice> {
		const notice = await this.noticeModel
			.findById(id)
			.lean()
			.exec();
		if (!notice) {
			throw new ApiException('数据不存在', ApiErrorCode.NO_EXIST, 404);
		}
		return notice;
	}
	// 详情
	async all(): Promise<INotice[]> {
		return await this.noticeModel
			.find({ isDelete: false })
			.lean()
			.exec();
	}

	// 软删除
	async remove(id: string, user: string) {
		return await this.noticeModel.findByIdAndUpdate(id, {
			isDelete: true,
			deleteTime: Date.now(),
			deleteBy: user,
		});
	}

	// 恢复
	async recover(id: string) {
		return await this.noticeModel.findByIdAndUpdate(id, {
			isDelete: false,
			$unset: { deleteTime: 1, deleteBy: 1 },
		});
	}

	// 微信授权
	async oauth(oauth: OAuthDTO): Promise<any> {
		const notice: INotice | null = await this.noticeModel.findOne({
			phone: oauth.phone,
		});
		if (!notice) {
			throw new ApiException('用户不存在', ApiErrorCode.NO_PERMISSION, 403);
		}
		// 解释用户数据
		const openId = await this.weixinUtil.oauth(oauth.code);
		if (!openId) {
			throw new ApiException('授权错误', ApiErrorCode.NO_PERMISSION, 403);
		}
		if (openId) {
			// 更新微信信息
			await this.noticeModel
				.findByIdAndUpdate(notice._id, {
					openId,
					isWeixinNotice: true,
				})
				.lean()
				.exec();
		}
		return true;
	}

	// 修改短信推送权限
	async phoneNotice(id: string, isPhoneNotice: boolean) {
		return await this.noticeModel.findByIdAndUpdate(id, { isPhoneNotice });
	}

	// 修改微信推送权限
	async weixinNotice(id: string, isWeixinNotice: boolean) {
		return await this.noticeModel.findByIdAndUpdate(id, { isWeixinNotice });
	}
}
