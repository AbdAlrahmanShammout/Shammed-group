import { Module } from '@nestjs/common';

import { DatabaseProviderModule } from '@/providers/database/database-provider.module';
import { JwtProviderModule } from '@/providers/jwt/jwt-provider.module';
import { SmtpProviderModule } from '@/providers/smtp/smtp-provider.module';
import { StorageProviderModule } from '@/providers/storage/storage-provider.module';

@Module({
  imports: [DatabaseProviderModule, JwtProviderModule, SmtpProviderModule, StorageProviderModule],
  exports: [DatabaseProviderModule, JwtProviderModule, SmtpProviderModule, StorageProviderModule],
})
export class ProviderModule {}
