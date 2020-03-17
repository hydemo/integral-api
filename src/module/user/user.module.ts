import { Module, MulterModule, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserService } from './user.service';
import { usersProviders } from './user.providers';
import { DatabaseModule } from 'src/database/database.module';
import { VipModule } from '../vip/vip.module';
import { MerchantModule } from '../merchant/merchant.module';


@Module({
  providers: [
    UserService,
    ...usersProviders,
  ],
  exports: [UserService],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    VipModule,
  ],
})

export class UserModule { }