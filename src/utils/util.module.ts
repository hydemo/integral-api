import { Module, Global } from '@nestjs/common';
import { CryptoUtil } from './crypto.util';
import { KDBirdUtil } from './kdbird.util';
import { PaginationUtil } from './pagination.util';
import { QiniuUtil } from './qiniu.util';
import { WeixinUtil } from './weixin.util';
import { RedisModule } from 'nestjs-redis';
import { ConfigService } from 'src/config/config.service';
import { TemplateUtil } from './template.util';
import { PhoneUtil } from './phone.util';
@Global()
@Module({
  providers: [
    CryptoUtil,
    KDBirdUtil,
    PaginationUtil,
    QiniuUtil,
    WeixinUtil,
    TemplateUtil,
    PhoneUtil,
  ],
  exports: [
    CryptoUtil,
    KDBirdUtil,
    PaginationUtil,
    QiniuUtil,
    WeixinUtil,
    TemplateUtil,
    PhoneUtil,
  ],
  imports: [
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.redis,
      inject: [ConfigService]
    }),
  ]
})
export class UtilModule { }