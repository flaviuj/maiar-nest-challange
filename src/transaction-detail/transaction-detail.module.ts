import { Module } from '@nestjs/common';

import { TransactionDetailController } from './transaction-detail.controller';
import { TransactionDetailService } from './transaction-detail.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionDetailEntity } from './entities/transaction-detail.entity';
import { TransactionDetailMetaEntity } from './entities/transaction-detail-meta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionDetailEntity,
      TransactionDetailMetaEntity,
    ]),
  ],
  controllers: [TransactionDetailController],
  providers: [TransactionDetailService],
})
export class TransactionDetailModule {}
