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
} from '@nestjs/common';
import {
	ApiUseTags,
	ApiOkResponse,
	ApiForbiddenResponse,
	ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { VipCardService } from 'src/module/vipCard/vipCard.service';
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
import { GoodService } from 'src/module/good/good.service';
import { ExchangeDTO } from 'src/module/integration/integration.dto';
import { CreateWithdrawDTO } from 'src/module/withdraw/withdraw.dto';
import { WithdrawService } from 'src/module/withdraw/withdraw.service';
import { AmbassadorCardService } from 'src/module/ambassadorCard/ambassadorCard.service';

@ApiUseTags('user')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard())
@Controller('users')
export class ApiUserController {
	constructor(
		@Inject(VipCardService) private vipCardService: VipCardService,
		@Inject(UserService) private userService: UserService,
		@Inject(IntegrationService) private integrationService: IntegrationService,
		@Inject(CryptoUtil) private cryptoUtil: CryptoUtil,
		@Inject(WithdrawService) private withdrawService: WithdrawService,
		@Inject(AmbassadorCardService)
		private ambassadorCardService: AmbassadorCardService,
	) {}

	@Get('/balance')
	@ApiOkResponse({
		description: '余额',
	})
	@ApiOperation({ title: '余额', description: '余额' })
	async list(@Request() req: any): Promise<any> {
		return req.user.balance;
	}

	@Get('/address')
	@ApiOkResponse({
		description: '获取积分地址',
	})
	@ApiOperation({ title: '获取积分地址', description: '获取积分地址' })
	async integrationAddress(@Request() req: any): Promise<any> {
		return req.user.integrationAddress;
	}

	@Get('/integration')
	@ApiOkResponse({
		description: '用户积分',
	})
	@ApiOperation({ title: '用户积分', description: '用户积分' })
	async integration(@Request() req: any): Promise<any> {
		return { integration: req.user.integration };
	}

	@Post('/integration')
	@ApiOkResponse({
		description: '赠送积分',
	})
	@ApiOperation({ title: '赠送积分', description: '赠送积分' })
	async giveIntegration(
		@Body() integration: GiveIntegrationDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.integrationService.giveIntegration(
			req.user._id,
			integration.address,
			integration.count,
		);
	}

	@Post('/integration/exchange')
	@ApiOkResponse({
		description: '积分兑换',
	})
	@ApiOperation({ title: '积分兑换', description: '积分兑换' })
	async exchange(
		@Body() integration: ExchangeDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.integrationService.exchange(
			req.user._id,
			integration.count,
		);
	}

	@Post('/vipCard')
	@ApiOkResponse({
		description: '使用会员卡',
	})
	@ApiOperation({ title: '使用会员卡', description: '使用会员卡' })
	async vipCard(
		@Body() vipCard: VipCardDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.vipCardService.useVipCard(vipCard, req.user._id);
	}

	@Post('/ambassador')
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
	@ApiOkResponse({
		description: '实名认证',
	})
	@ApiOperation({ title: '实名认证', description: '实名认证' })
	async verify(@Body() verify: VerifyDTO, @Request() req: any): Promise<any> {
		return await this.userService.verify(verify, req.user._id);
	}

	@Put('/verify')
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

	@Get('/verify')
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
			bankAddress: req.user.bankAddress,
			bankNumber: req.user.bankNumber
				? this.cryptoUtil.signLongString(req.user.bankNumber)
				: '',
		};
		return signVerify;
	}

	@Get('/integrations/invite')
	@ApiOkResponse({
		description: '推荐新人列表',
	})
	@ApiOperation({ title: '推荐新人列表', description: '推荐新人列表' })
	async invite(
		@Query() pagination: Pagination,
		@Request() req: any,
	): Promise<any> {
		return this.integrationService.listByUser(pagination, 2, req.user._id);
	}

	@Get('/integrations/share')
	@ApiOkResponse({
		description: '分享商品',
	})
	@ApiOperation({ title: '分享商品', description: '分享商品' })
	async share(
		@Query() pagination: Pagination,
		@Request() req: any,
	): Promise<any> {
		return this.integrationService.listByUser(pagination, 3, req.user._id);
	}

	@Get('/integrations/goods')
	@ApiOkResponse({
		description: '上架推广商品',
	})
	@ApiOperation({ title: '上架推广商品', description: '上架推广商品' })
	async goods(
		@Query() pagination: Pagination,
		@Request() req: any,
	): Promise<any> {
		return this.integrationService.listByUser(pagination, 4, req.user._id);
	}

	@Get('/withdraws')
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

	@Post('/withdraws')
	@ApiOkResponse({
		description: '提现申请列表',
	})
	@ApiOperation({ title: '提现申请列表', description: '提现申请列表' })
	async withdrawApplication(
		@Query() withdraw: CreateWithdrawDTO,
		@Request() req: any,
	): Promise<any> {
		return this.withdrawService.create(withdraw.amount, req.user);
	}
}
