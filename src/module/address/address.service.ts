import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { IAddress } from './address.interfaces';
import { ApiErrorCode } from '@common/enum/api-error-code.enum';
import { ApiException } from '@common/expection/api.exception';
import { Pagination } from 'src/common/dto/pagination.dto';
import { IList } from 'src/common/interface/list.interface';
import { CreateAddressDTO } from './address.dto';

@Injectable()
export class AddressService {
	constructor(
		@Inject('AddressModelToken') private readonly addressModel: Model<IAddress>,
	) {}

	// 创建数据
	async create(address: CreateAddressDTO, user: string): Promise<IAddress> {
		await this.addressModel.updateMany({ user }, { isDefault: false });
		return await this.addressModel.create({ ...address, user });
	}

	// 创建数据
	async createMerchantAddress(address: CreateAddressDTO): Promise<IAddress> {
		return await this.addressModel.create({ ...address, type: 'merchant' });
	}

	// 列表
	async list(pagination: Pagination, user: string): Promise<IList<IAddress>> {
		const condition = { user };
		const list = await this.addressModel
			.find(condition)
			.limit(pagination.pageSize)
			.skip((pagination.current - 1) * pagination.pageSize)
			.sort({ isDefault: -1, createdAt: -1 })
			.lean()
			.exec();
		const total = await this.addressModel.countDocuments(condition);
		return { list, total };
	}

	// 列表
	async merchantList(pagination: Pagination): Promise<IList<IAddress>> {
		const condition = { type: 'merchant' };
		const list = await this.addressModel
			.find(condition)
			.limit(pagination.pageSize)
			.skip((pagination.current - 1) * pagination.pageSize)
			.sort({ isDefault: -1, createdAt: -1 })
			.lean()
			.exec();
		const total = await this.addressModel.countDocuments(condition);
		return { list, total };
	}

	// 删除数据
	async findByIdAndRemove(id: string, user: string): Promise<boolean> {
		const address = await this.addressModel
			.findById(id)
			.lean()
			.exec();
		if (!address) {
			return true;
		}
		if (String(address.user) !== String(user)) {
			throw new ApiException('无权限', ApiErrorCode.NO_PERMISSION, 403);
		}
		await this.addressModel.findByIdAndRemove(id);
		return true;
	}

	// 修改数据
	async findByIdAndUpdate(
		id: string,
		user: string,
		newAddress: CreateAddressDTO,
	): Promise<boolean> {
		const address = await this.addressModel
			.findById(id)
			.lean()
			.exec();
		if (!address) {
			return true;
		}
		if (String(address.user) !== String(user)) {
			throw new ApiException('无权限', ApiErrorCode.NO_PERMISSION, 403);
		}
		await this.addressModel.findByIdAndUpdate(id, newAddress);
		return true;
	}

	// 根据用户查找数据
	async findByUser(user: string): Promise<IAddress | null> {
		return await this.addressModel
			.findOne({ user, isDefault: true })
			.lean()
			.exec();
	}

	// 根据用户查找数据
	async findById(id: string): Promise<IAddress | null> {
		return await this.addressModel
			.findById(id)
			.lean()
			.exec();
	}

	// 设为默认值
	async setDefault(id: string, user: string): Promise<boolean> {
		const address = await this.addressModel
			.findById(id)
			.lean()
			.exec();
		if (!address) {
			return true;
		}
		if (String(address.user) !== String(user)) {
			throw new ApiException('无权限', ApiErrorCode.NO_PERMISSION, 403);
		}
		const defaultAddress = await this.addressModel.findOne({
			user,
			isDefault: true,
		});
		if (defaultAddress && String(defaultAddress._id) !== id) {
			await this.addressModel.findByIdAndUpdate(defaultAddress._id, {
				isDefault: false,
			});
		}
		await this.addressModel.findByIdAndUpdate(id, { isDefault: true });
		return true;
	}

	async removeByMerchant(id: string) {
		await this.addressModel.findByIdAndDelete(id);
		return true;
	}

	async updateByMerchant(id: string, address: CreateAddressDTO) {
		await this.addressModel.findByIdAndUpdate(id, address);
		return true;
	}
}
