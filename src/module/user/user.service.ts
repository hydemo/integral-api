import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { IUser } from './user.interfaces';
import { Pagination } from '@common/dto/pagination.dto';
import { IList } from '@common/interface/list.interface';
import { JwtService } from '@nestjs/jwt';
import { ApiErrorCode } from '@common/enum/api-error-code.enum';
import { ApiException } from '@common/expection/api.exception';
import { WeixinUtil } from '@utils/weixin.util';
import { LoginDTO } from './login.dto';
import { PaginationUtil } from 'src/utils/pagination.util';
import { RedisService } from 'nestjs-redis';
import { VerifyDTO, UpdateVerifyDTO } from './users.dto';
import { CryptoUtil } from 'src/utils/crypto.util';
import * as moment from 'moment';

@Injectable()
export class UserService {
	// 注入的UserModelToken要与users.providers.ts里面的key一致就可以
	constructor(
		@Inject('UserModelToken') private readonly userModel: Model<IUser>,
		@Inject(WeixinUtil) private readonly weixinUtil: WeixinUtil,
		@Inject(CryptoUtil) private readonly cryptoUtil: CryptoUtil,
		@Inject(JwtService) private readonly jwtService: JwtService,
		@Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
		private redis: RedisService,
	) {}

	// 根据id查询
	async findById(_id: string): Promise<IUser | null> {
		return await this.userModel
			.findById(_id)
			.lean()
			.exec();
	}
	// 根据积分地址查询
	async findByIntegrationAddress(integrationAddress: string): Promise<IUser> {
		const data = await this.userModel
			.findOne({ integrationAddress })
			.lean()
			.exec();
		if (!data) {
			throw new ApiException('积分地址有误', ApiErrorCode.NO_EXIST, 404);
		}
		return data;
	}

	// 用户列表
	async list(pagination: Pagination, inviteBy?: string): Promise<IList<IUser>> {
		const condition = this.paginationUtil.genCondition(pagination, [
			'nickname',
			'phone',
		]);
		if (inviteBy) {
			condition.inviteBy = inviteBy;
		}
		const list = await this.userModel
			.find(condition)
			.limit(pagination.pageSize)
			.skip((pagination.current - 1) * pagination.pageSize)
			.sort({ createdAt: -1 })
			.populate({
				path: 'inviteBy',
				model: 'user',
				select: '_id nickname',
			})
			.lean()
			.then(users => {
				return users.map(item => {
					if (item.phone) {
						return { ...item, phone: this.cryptoUtil.aesDecrypt(item.phone) };
					} else {
						return item;
					}
				});
			});

		const total = await this.userModel.countDocuments(condition);
		return { list, total };
	}

	// 根据id修改
	async updateById(_id: any, user: any) {
		return await this.userModel.findByIdAndUpdate(_id, user).exec();
	}

	// 修改邀请人
	async updateInviteBy(id: string, inviteBy: string) {
		if (String(id) === String(inviteBy)) {
			throw new ApiException('无权限', ApiErrorCode.NO_PERMISSION, 403);
		}
		if (!inviteBy) {
			return await this.userModel.findByIdAndUpdate(id, {
				$unset: { inviteBy: 1 },
			});
		}
		const inviteUser = await this.userModel.findById(inviteBy);
		if (!inviteUser) {
			throw new ApiException('邀请人有误', ApiErrorCode.INPUT_ERROR, 404);
		}
		await this.userModel.findByIdAndUpdate(id, { inviteBy });
	}

	// 修改邀请人
	async updateAmbassadorLevel(id: string, ambassadorLevel: number) {
		if (!ambassadorLevel) {
			return await this.userModel.findByIdAndUpdate(id, {
				$unset: { ambassadorLevel: 1 },
			});
		}
		await this.userModel.findByIdAndUpdate(id, { ambassadorLevel });
	}

	async loginByWeixin(login: LoginDTO, ip: string): Promise<any> {
		// 解释用户数据
		const userInfo = await this.weixinUtil.login(login.code, login);
		if (!userInfo) {
			throw new ApiException('登录失败', ApiErrorCode.LOGIN_ERROR, 406);
		}
		let inviteUser: any = null;
		if (login.inviteBy) {
			inviteUser = await this.userModel
				.findById(login.inviteBy)
				.select({ _id: 1, nickname: 1, avatar: 1 });
			if (!inviteUser) {
				throw new ApiException('邀请人不存在', ApiErrorCode.NO_EXIST, 404);
			}
		}
		// 根据openid查找用户是否已经注册
		let user: IUser = await this.userModel
			.findOne({ weixinOpenid: userInfo.openId })
			.select({
				// 姓名
				realName: 0,
				// 手机号
				phone: 0,
				// 身份证
				cardNumber: 0,
				// 银行卡
				bankCard: 0,
				// 银行
				bank: 0,
				// 开户行
				bankAddress: 0,
				// 积分地址
				integrationAddress: 0,
			})
			.lean()
			.populate({
				path: 'inviteBy',
				model: 'user',
				select: '_id nickname avatar',
			})
			.exec();
		if (!user) {
			// 注册
			user = await this.userModel.create({
				registerTime: Date.now(),
				registerIp: ip,
				weixinOpenid: userInfo.openId,
				avatar: userInfo.avatarUrl || '',
				gender: userInfo.gender || 0, // 性别 0：未知、1：男、2：女
				nickname: userInfo.nickName,
				integrationAddress: this.cryptoUtil.createBitcoinAddress(),
				inviteBy: login.inviteBy,
			});
			const client = this.redis.getClient();
			user.inviteBy = inviteUser;

			await client.hincrby('dataRecord', 'users', 1);
		}
		// 更新登录信息
		await this.userModel.findByIdAndUpdate(user._id, {
			lastLoginTime: Date.now(),
			lastLoginIp: ip,
		});

		const accessToken = await this.jwtService.sign({
			id: user._id,
			type: 'user',
		});

		if (!user || !accessToken) {
			throw new ApiException('登录失败', ApiErrorCode.LOGIN_ERROR, 406);
		}
		delete user.weixinOpenid;

		return { userinfo: user, accessToken };
	}

	async block(id: string, admin: string) {
		await this.userModel.findByIdAndUpdate(id, {
			isBlock: true,
			blockTime: new Date(),
			blockBy: admin,
		});
		return;
	}

	async unblock(id: string, admin: string) {
		await this.userModel.findByIdAndUpdate(id, {
			unBlockBy: admin,
			isBlock: false,
			$unset: { blockTime: 1 },
		});
		return;
	}

	async getVerify(id: string) {
		const user = await this.userModel.findById(id).lean();
		if (!user) {
			return {};
		}
		return {
			nickname: user.nickname,
			avatar: user.avatar,
			realName: user.realName ? this.cryptoUtil.aesDecrypt(user.realName) : '',
			phone: user.phone ? this.cryptoUtil.aesDecrypt(user.phone) : '',
			cardNumber: user.cardNumber
				? this.cryptoUtil.aesDecrypt(user.cardNumber)
				: '',
			bank: user.bank,
			bankAddress: user.bankAddress,
			bankNumber: user.bankNumber
				? this.cryptoUtil.aesDecrypt(user.bankNumber)
				: '',
		};
	}

	// 修改余额
	async incBalance(id: string, inc: number) {
		const user = await this.userModel.findById(id);
		if (!user) {
			throw new ApiException('无该用户', ApiErrorCode.NO_EXIST, 404);
		}
		const newBalance = Number((user.balance + inc).toFixed(2));
		await this.userModel.findByIdAndUpdate(id, {
			balance: newBalance,
		});
		return;
	}

	// 修改剩余积分
	async incIntegration(id: string, inc: number) {
		const user = await this.userModel.findById(id);
		if (!user) {
			throw new ApiException('无该用户', ApiErrorCode.NO_EXIST, 404);
		}
		const integration = Number(user.integration + inc).toFixed(3);
		await this.userModel.findByIdAndUpdate(id, { integration });
		return;
	}

	// 统计数量
	async countByCondition(condition: any) {
		return await this.userModel.countDocuments(condition);
	}

	// 实名认证
	async verify(verify: VerifyDTO, user: string) {
		const signVerify: VerifyDTO = {
			realName: this.cryptoUtil.aesEncrypt(verify.realName),
			phone: this.cryptoUtil.aesEncrypt(verify.phone),
			cardNumber: this.cryptoUtil.aesEncrypt(verify.cardNumber),
			bank: verify.bank,
			bankAddress: verify.bankAddress,
			bankNumber: this.cryptoUtil.aesEncrypt(verify.bankNumber),
		};
		const phoneExist = await this.userModel.findOne({
			phone: signVerify.phone,
			_id: { $ne: user },
		});
		if (phoneExist) {
			throw new ApiException('手机号已注册', ApiErrorCode.EXIST, 406);
		}
		const cardNumberExist = await this.userModel.findOne({
			cardNumber: signVerify.cardNumber,
			_id: { $ne: user },
		});
		if (cardNumberExist) {
			throw new ApiException('身份证已注册', ApiErrorCode.EXIST, 406);
		}
		await this.userModel.findByIdAndUpdate(user, {
			...signVerify,
			isVerify: true,
		});
		return;
	}

	// 更改实名认证
	async updateVerify(verify: UpdateVerifyDTO, user: IUser) {
		if (!user.isVerify) {
			throw new ApiException('请先完善资料', ApiErrorCode.NO_PERMISSION, 403);
		}
		const update: any = { ...verify };
		if (verify.phone) {
			update.phone = this.cryptoUtil.aesEncrypt(verify.phone);
			const phoneExist = await this.userModel.findOne({
				phone: update.phone,
				_id: { $ne: user._id },
			});
			if (phoneExist) {
				throw new ApiException('手机号已注册', ApiErrorCode.EXIST, 406);
			}
		}
		if (verify.cardNumber) {
			update.cardNumber = this.cryptoUtil.aesEncrypt(verify.cardNumber);
			const cardNumberExist = await this.userModel.findOne({
				cardNumber: update.cardNumber,
				_id: { $ne: user._id },
			});
			if (cardNumberExist) {
				throw new ApiException('身份证已注册', ApiErrorCode.EXIST, 406);
			}
		}
		if (verify.realName) {
			update.realName = this.cryptoUtil.aesEncrypt(verify.realName);
		}
		if (verify.bankNumber) {
			update.bankNumber = this.cryptoUtil.aesEncrypt(verify.bankNumber);
		}
		await this.userModel.findByIdAndUpdate(user._id, {
			...update,
		});
		return;
	}

	// 充值vip
	async changeVip(id: string) {
		const user = await this.userModel.findById(id);
		if (!user) {
			throw new ApiException('用户不存在', ApiErrorCode.NO_EXIST, 404);
		}
		const vipExpire = user.vipExpire;
		let newExpire = moment().add(1, 'year');
		if (vipExpire) {
			newExpire = moment(vipExpire).add(1, 'year');
		}
		await this.userModel.findByIdAndUpdate(user, {
			vipExpire: newExpire,
		});
		return;
	}

	// 充值vip
	async changeAmbassadorLevel(id: string, ambassadorLevel: number) {
		const user = await this.userModel.findById(id);
		if (!user) {
			throw new ApiException('用户不存在', ApiErrorCode.NO_EXIST, 404);
		}

		await this.userModel.findByIdAndUpdate(user, { ambassadorLevel });
		return;
	}
}
