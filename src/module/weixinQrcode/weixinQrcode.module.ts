import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { weixinQrcodeProviders } from './weixinQrcode.providers';
import { WeixinQrcodeService } from './weixinQrcode.service';

@Module({
  providers: [
    WeixinQrcodeService,
    ...weixinQrcodeProviders,
  ],
  exports: [
    WeixinQrcodeService,
  ],
  imports: [
    DatabaseModule,
  ],
})
export class WeixinQrcodeModule { }