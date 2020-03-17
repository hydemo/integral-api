import { Module } from '@nestjs/common';
import { CarouselService } from './carousel.service';
import { carouselsProviders } from './carousel.providers';
import { DatabaseModule } from '@database/database.module';

@Module({
  providers: [
    CarouselService,
    ...carouselsProviders,
  ],
  exports: [CarouselService],
  imports: [
    DatabaseModule,
  ],
})

export class CarouselModule { }
