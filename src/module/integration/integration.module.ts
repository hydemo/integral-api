import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { integrationProviders } from './integration.providers';
import { IntegrationService } from './integration.service';
import { UserModule } from '../user/user.module';

@Module({
  providers: [
    IntegrationService,
    ...integrationProviders,
  ],
  exports: [
    IntegrationService,
  ],
  imports: [
    UserModule,
    DatabaseModule,
  ],
})
export class IntegrationModule { }