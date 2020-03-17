import {
  Body,
  Controller,
  Post,
  Request,
  Query,
  Get,
} from '@nestjs/common';
import {
  ApiUseTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { LoginDTO } from 'src/module/user/login.dto';
import { UserService } from 'src/module/user/user.service';
import { IntegrationService } from 'src/module/integration/integration.service';
import { CreateIntegrationDTO } from 'src/module/integration/integration.dto';
import { MerchantService } from 'src/module/merchant/merchant.service';


// UseGuards()傳入@nest/passport下的AuthGuard
@ApiUseTags('login')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('api')
export class ApiLoginController {
  constructor(
    private userService: UserService,
    private integrationService: IntegrationService,
    private readonly merchantService: MerchantService,
  ) { }

  @Post('/login/weixin')
  @ApiOkResponse({
    description: '微信登录',
  })
  @ApiOperation({ title: '微信登录', description: '微信登录' })
  async loginByWeixinAction(
    @Body() login: LoginDTO,
    @Request() req) {
    const clientIp = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : req.ip.replace(/::ffff:/, '');
    const data = await this.userService.loginByWeixin(login, clientIp);
    if (login.promoteUser && data.newUser) {

      const newIntegration: CreateIntegrationDTO = {
        user: data.newUser,
        count: 50,
        type: 'add',
        sourceType: 5,
        sourceId: login.promoteUser,
      }
      await this.integrationService.create(newIntegration)

      const newPromoteIntegration: CreateIntegrationDTO = {
        user: login.promoteUser,
        count: 50,
        type: 'add',
        sourceType: 5,
        sourceId: login.promoteUser,
      }
      await this.integrationService.create(newPromoteIntegration)
    }
    let merchant: any = null
    if (data.userinfo.merchant) {
      merchant = await this.merchantService.findById(data.userinfo.merchant)
      data.merchant = merchant
    }
    return { userinfo: data.userinfo, accessToken: data.accessToken, merchant }
  }
}