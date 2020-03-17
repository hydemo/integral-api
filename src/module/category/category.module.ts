import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { categorysProviders } from './category.providers';
import { DatabaseModule } from '@database/database.module';

@Module({
  providers: [
    CategoryService,
    ...categorysProviders,
  ],
  exports: [CategoryService],
  imports: [
    DatabaseModule,
  ],
})

export class CategoryModule { }
