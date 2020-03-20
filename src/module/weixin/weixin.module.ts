import { Module } from '@nestjs/common';

import { WeixinService } from './weixin.service';
import { WeixinController } from './weixin.controller';
import { OrderModule } from '../order/order.module';

@Module({
	providers: [WeixinService],
	exports: [WeixinService],
	controllers: [WeixinController],
	imports: [OrderModule],
})
export class WeixinModule {}
