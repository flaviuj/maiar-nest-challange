import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionDetailModule } from './transaction-detail/transaction-detail.module';
import { TransactionDetailEntity } from './transaction-detail/entities/transaction-detail.entity';
import { TransactionDetailMetaEntity } from './transaction-detail/entities/transaction-detail-meta.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT')),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [TransactionDetailEntity, TransactionDetailMetaEntity],
        logging: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TransactionDetailModule,
  ],
})
export class AppModule {}
