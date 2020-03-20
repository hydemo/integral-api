import { Module } from '@nestjs/common';
import { UserBalanceService } from './userBalance.service';
import { userBalancesProviders } from './userBalance.providers';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
	providers: [UserBalanceService, ...userBalancesProviders],
	exports: [UserBalanceService],
	imports: [DatabaseModule, UserModule],
})
export class UserBalanceModule {}
