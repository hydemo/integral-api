import { Module } from '@nestjs/common';
import { VipCardService } from './vipCard.service';
import { vipCardsProviders } from './vipCard.providers';
import { DatabaseModule } from '@database/database.module';
import { UserModule } from '../user/user.module';

@Module({
	providers: [VipCardService, ...vipCardsProviders],
	exports: [VipCardService],
	imports: [DatabaseModule, UserModule],
})
export class VipCardModule {}
