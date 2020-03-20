import {
	Body,
	Controller,
	Get,
	Post,
	UseGuards,
	Inject,
	Request,
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
} from 'src/module/user/users.dto';
import { UserService } from 'src/module/user/user.service';
import { CryptoUtil } from 'src/utils/crypto.util';
import { IntegrationService } from 'src/module/integration/integration.service';
import { Pagination } from 'src/common/dto/pagination.dto';
import { GoodService } from 'src/module/good/good.service';

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
		@Inject(GoodService) private goodService: GoodService,
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

	@Post('/vipCard')
	@ApiOkResponse({
		description: '充值升级vip',
	})
	@ApiOperation({ title: '充值升级vip', description: '充值升级vip' })
	async vipCard(
		@Body() vipCard: VipCardDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.vipCardService.useVipCard(vipCard, req.user._id);
	}

	@Post('/verify')
	@ApiOkResponse({
		description: '实名认证',
	})
	@ApiOperation({ title: '实名认证', description: '实名认证' })
	async verify(@Body() verify: VerifyDTO, @Request() req: any): Promise<any> {
		return await this.userService.verify(verify, req.user._id);
	}

	@Get('/verify')
	@ApiOkResponse({
		description: '获取实名认证详情',
	})
	@ApiOperation({ title: '获取实名认证详情', description: '获取实名认证详情' })
	async verifyInfo(@Request() req: any): Promise<any> {
		const signVerify: VerifyDTO = {
			realName: this.cryptoUtil.signName(req.user.realName),
			phone: this.cryptoUtil.aesEncrypt(req.user.phone),
			cardNumber: this.cryptoUtil.aesEncrypt(req.user.cardNumber),
			bank: req.user.bank,
			bandAddress: req.user.bandAddress,
			bankNumber: this.cryptoUtil.aesEncrypt(req.user.bankNumber),
		};
		return signVerify;
	}

	@Get('/invite')
	@ApiOkResponse({
		description: '邀请用户列表',
	})
	@ApiOperation({ title: '邀请用户列表', description: '邀请用户列表' })
	async invite(
		@Query() pagination: Pagination,
		@Request() req: any,
	): Promise<any> {
		return this.userService.list(pagination, req.user._id);
	}

	@Get('/goods')
	@ApiOkResponse({
		description: '上架推广商品',
	})
	@ApiOperation({ title: '上架推广商品', description: '上架推广商品' })
	async goods(
		@Query() pagination: Pagination,
		@Request() req: any,
	): Promise<any> {
		return this.goodService.listByUser(pagination, {
			recommendUser: req.user._id,
		});
	}
}
