import {
	Body,
	Controller,
	Get,
	Post,
	UseGuards,
	Inject,
	Request,
	Put,
	Query,
	Param,
} from '@nestjs/common';
import {
	ApiUseTags,
	ApiOkResponse,
	ApiForbiddenResponse,
	ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
	VipCardDTO,
	VerifyDTO,
	GiveIntegrationDTO,
	UpdateVerifyDTO,
} from 'src/module/user/users.dto';
import { UserService } from 'src/module/user/user.service';
import { CryptoUtil } from 'src/utils/crypto.util';
import { IntegrationService } from 'src/module/integration/integration.service';
import { Pagination } from 'src/common/dto/pagination.dto';
import { ExchangeDTO } from 'src/module/integration/integration.dto';
import { CreateWithdrawDTO } from 'src/module/withdraw/withdraw.dto';
import { WithdrawService } from 'src/module/withdraw/withdraw.service';
import { AmbassadorCardService } from 'src/module/ambassadorCard/ambassadorCard.service';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';
import { UserBalanceService } from 'src/module/userBalance/userBalance.service';

@ApiUseTags('user')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('users')
export class ApiUserController {
	constructor(
		@Inject(UserService) private userService: UserService,
		@Inject(UserBalanceService) private uerBalanceService: UserBalanceService,
		@Inject(IntegrationService) private integrationService: IntegrationService,
		@Inject(CryptoUtil) private cryptoUtil: CryptoUtil,
		@Inject(WithdrawService) private withdrawService: WithdrawService,
		@Inject(AmbassadorCardService)
		private ambassadorCardService: AmbassadorCardService,
	) {}

	@Get('/balance')
	@UseGuards(AuthGuard())
	@ApiOkResponse({
		description: '余额',
	})
	@ApiOperation({ title: '余额', description: '余额' })
	async balance(@Request() req: any): Promise<any> {
		return req.user.balance;
	}

	@Get('/balance/list')
	@UseGuards(AuthGuard())
	@ApiOkResponse({
		description: '余额',
	})
	@ApiOperation({ title: '余额', description: '余额' })
	async balances(
		@Request() req: any,
		@Query() pagination: Pagination,
	): Promise<any> {
		return this.uerBalanceService.listByUser(pagination, req.user._id);
	}

	@Get('/address')
	@UseGuards(AuthGuard())
	@ApiOkResponse({
		description: '获取积分地址',
	})
	@ApiOperation({ title: '获取积分地址', description: '获取积分地址' })
	async integrationAddress(@Request() req: any): Promise<any> {
		return req.user.integrationAddress;
	}

	@Get('/integration')
	@UseGuards(AuthGuard())
	@ApiOkResponse({
		description: '用户积分',
	})
	@ApiOperation({ title: '用户积分', description: '用户积分' })
	async integration(@Request() req: any): Promise<any> {
		return { integration: req.user.integration };
	}

	@Get('/integration/list')
	@UseGuards(AuthGuard())
	@ApiOkResponse({
		description: '用户积分历史',
	})
	@ApiOperation({ title: '用户积分历史', description: '用户积分历史' })
	async integrations(
		@Request() req: any,
		@Query() pagination: Pagination,
	): Promise<any> {
		return this.integrationService.listByUser(pagination, req.user._id);
	}

	@Post('/integration')
	@UseGuards(AuthGuard())
	@ApiOkResponse({
		description: '赠送积分',
	})
	@ApiOperation({ title: '赠送积分', description: '赠送积分' })
	async giveIntegration(
		@Body() integration: GiveIntegrationDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.integrationService.giveIntegration(
			req.user,
			integration.address,
			integration.count,
		);
	}

	@Post('/integration/exchange')
	@UseGuards(AuthGuard())
	@ApiOkResponse({
		description: '积分兑换',
	})
	@ApiOperation({ title: '积分兑换', description: '积分兑换' })
	async exchange(
		@Body() integration: ExchangeDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.integrationService.exchange(req.user, integration.count);
	}

	@Post('/ambassador')
	@UseGuards(AuthGuard())
	@ApiOkResponse({
		description: '使用大使码',
	})
	@ApiOperation({ title: '使用大使码', description: '使用大使码' })
	async ambassadorCard(
		@Body() vipCard: VipCardDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.ambassadorCardService.useAmbassadorCard(
			vipCard,
			req.user._id,
		);
	}

	@Post('/verify')
	@UseGuards(AuthGuard())
	@ApiOkResponse({
		description: '实名认证',
	})
	@ApiOperation({ title: '实名认证', description: '实名认证' })
	async verify(@Body() verify: VerifyDTO, @Request() req: any): Promise<any> {
		return await this.userService.verify(verify, req.user._id);
	}

	@Put('/verify')
	@UseGuards(AuthGuard())
	@ApiOkResponse({
		description: '修改实名认证',
	})
	@ApiOperation({ title: '修改实名认证', description: '修改实名认证' })
	async updateVerify(
		@Body() verify: UpdateVerifyDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.userService.updateVerify(verify, req.user);
	}

	@Get('/me')
	@UseGuards(AuthGuard())
	@ApiOkResponse({
		description: '获取我的个人信息',
	})
	@ApiOperation({ title: '获取我的个人信息', description: '获取我的个人信息' })
	async me(@Request() req: any): Promise<any> {
		return {
			// 注册时间
			registerTime: req.user.registerTime,
			// 注册ip
			registerIp: req.user.registerTime,
			// 头像
			avatar: req.user.avatar,
			// 性别
			gender: req.user.gender,
			// 昵称
			nickname: req.user.nickname,
			// 禁用时间
			balance: req.user.balance,
			// 用户当前积分
			integration: req.user.integration,
			// vip有效期
			vipExpire: req.user.vipExpire,
			// 是否新用户
			isNewUser: req.user.isNewUser,
			// 是否实名认证
			isVerify: req.user.isVerify,
			// 积分地址
			integrationAddress: req.user.integrationAddress,
			// 邀请人
			inviteBy: req.user.inviteBy,
			// 团队
			team: req.user.team,
			// 推广大使级别
			ambassadorLevel: req.user.ambassadorLevel,
		};
	}

	@Get('/verify')
	@UseGuards(AuthGuard())
	@ApiOkResponse({
		description: '获取实名认证详情',
	})
	@ApiOperation({ title: '获取实名认证详情', description: '获取实名认证详情' })
	async verifyInfo(@Request() req: any): Promise<any> {
		if (!req.user.isVerify) {
			return null;
		}
		const signVerify: VerifyDTO = {
			realName: req.user.realName
				? this.cryptoUtil.signName(req.user.realName)
				: '',
			phone: req.user.phone
				? this.cryptoUtil.signLongString(req.user.phone)
				: '',
			cardNumber: req.user.cardNumber
				? this.cryptoUtil.signLongString(req.user.cardNumber)
				: '',
			bank: req.user.bank,
			team: req.user.team,
			bankAddress: req.user.bankAddress,
			bankNumber: req.user.bankNumber
				? this.cryptoUtil.signLongString(req.user.bankNumber)
				: '',
		};
		return signVerify;
	}

	@Get('/integrations/invite')
	@UseGuards(AuthGuard())
	@ApiOkResponse({
		description: '推荐新人列表',
	})
	@ApiOperation({ title: '推荐新人列表', description: '推荐新人列表' })
	async invite(
		@Query() pagination: Pagination,
		@Request() req: any,
	): Promise<any> {
		return this.integrationService.invites(pagination, req.user._id);
	}

	@Get('/integrations/share')
	@UseGuards(AuthGuard())
	@ApiOkResponse({
		description: '分享商品',
	})
	@ApiOperation({ title: '分享商品', description: '分享商品' })
	async share(
		@Query() pagination: Pagination,
		@Request() req: any,
	): Promise<any> {
		return this.integrationService.listByUser(pagination, req.user._id, 3);
	}

	@Get('/integrations/goods')
	@UseGuards(AuthGuard())
	@ApiOkResponse({
		description: '上架推广商品',
	})
	@ApiOperation({ title: '上架推广商品', description: '上架推广商品' })
	async goods(
		@Query() pagination: Pagination,
		@Request() req: any,
	): Promise<any> {
		return this.integrationService.listByUser(pagination, req.user._id, 4);
	}

	@Get('/withdraws')
	@UseGuards(AuthGuard())
	@ApiOkResponse({
		description: '提现申请列表',
	})
	@ApiOperation({ title: '提现申请列表', description: '提现申请列表' })
	async withdraws(
		@Query() pagination: Pagination,
		@Request() req: any,
	): Promise<any> {
		return this.withdrawService.listByUser(pagination, req.user._id);
	}

	@Get('/withdraws/info')
	@UseGuards(AuthGuard())
	@ApiOkResponse({
		description: '今日提现信息',
	})
	@ApiOperation({ title: '今日提现信息', description: '今日提现信息' })
	async withdrawInfo(@Request() req: any): Promise<any> {
		return this.withdrawService.withdrawInfo(req.user._id);
	}

	@Post('/withdraws')
	@UseGuards(AuthGuard())
	@ApiOkResponse({
		description: '提现申请列表',
	})
	@ApiOperation({ title: '提现申请列表', description: '提现申请列表' })
	async withdrawApplication(
		@Body() withdraw: CreateWithdrawDTO,
		@Request() req: any,
	): Promise<any> {
		return this.withdrawService.create(withdraw.amount, req.user);
	}

	@Get('/:id')
	@ApiOkResponse({
		description: '用户详情',
	})
	@ApiOperation({ title: '用户详情', description: '用户详情' })
	async detail(@Param('id', new MongodIdPipe()) id: string): Promise<any> {
		const user = await this.userService.findById(id);
		if (!user) {
			return null;
		}
		return { _id: user._id, nickname: user.nickname, avatar: user.avatar };
	}
}
