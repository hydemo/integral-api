import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { shipFeeProviders } from './shipFee.providers';
import { ShipFeeService } from './shipFee.service';

@Module({
	providers: [ShipFeeService, ...shipFeeProviders],
	exports: [ShipFeeService],
	imports: [DatabaseModule],
})
export class ShipFeeModule {}
