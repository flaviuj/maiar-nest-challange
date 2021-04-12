import {
  Body,
  Query,
  Controller,
  Get,
  Post,
  Param,
  HttpCode,
} from '@nestjs/common';
import { TransactionDetailService } from './transaction-detail.service';
import { TransactionDetailEntity } from './entities/transaction-detail.entity';

import { TransactionDetailFiltersInterface } from './interfaces';
import { CreateAttachmentDto } from './dto';

@Controller('/transaction-details')
export class TransactionDetailController {
  constructor(
    private readonly transactionDetailService: TransactionDetailService,
  ) {}

  @Get()
  getTransactionDetails(
    @Query() query: TransactionDetailFiltersInterface,
  ): Promise<TransactionDetailEntity[]> {
    return this.transactionDetailService.getAll(query);
  }

  @Get(':chain_id')
  getTransactionDetail(
    @Param('chain_id') id: string,
  ): Promise<TransactionDetailEntity> {
    return this.transactionDetailService.getOneByChainTransactionId(id);
  }

  @Post('/attachment')
  createTransactionDetailAttachment(
    @Body() post: CreateAttachmentDto,
  ): Promise<TransactionDetailEntity> {
    return this.transactionDetailService.createAttachment(post);
  }

  @HttpCode(200)
  @Post('/mark-as-seen/:chain_id')
  markTransactionDetailAttachmentAsSeen(
    @Param('chain_id') id: string,
  ): Promise<TransactionDetailEntity> {
    return this.transactionDetailService.markAttachmentAsSeen(id);
  }
}
