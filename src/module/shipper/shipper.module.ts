import { Module } from '@nestjs/common';
import { ShipperService } from './shipper.service';
import { shippersProviders } from './shipper.providers';
import { DatabaseModule } from '@database/database.module';

@Module({
	providers: [ShipperService, ...shippersProviders],
	exports: [ShipperService],
	imports: [DatabaseModule],
})
export class ShipperModule {}
