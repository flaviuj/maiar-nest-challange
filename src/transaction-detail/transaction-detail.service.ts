import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttachmentDto } from './dto';
import { TransactionDetailFiltersInterface } from './interfaces';
import { TransactionDetailEntity } from './entities/transaction-detail.entity';
import { TransactionDetailMetaEntity } from './entities/transaction-detail-meta.entity';

@Injectable()
export class TransactionDetailService {
  constructor(
    @InjectRepository(TransactionDetailEntity)
    private transactionDetailRepository: Repository<TransactionDetailEntity>,
    @InjectRepository(TransactionDetailMetaEntity)
    private transactionDetailMetaRepository: Repository<TransactionDetailMetaEntity>,
    private configService: ConfigService,
  ) {}

  async getAll(
    filters: TransactionDetailFiltersInterface = {},
  ): Promise<TransactionDetailEntity[]> {
    const page = filters.page || 1;
    const limit = filters.limit || 2;

    return this.transactionDetailRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getOneByChainTransactionId(
    transactionId: string,
  ): Promise<TransactionDetailEntity> {
    const transactionDetail = await this.transactionDetailRepository.findOne({
      where: {
        chainTransactionId: transactionId,
      },
    });

    if (!transactionDetail)
      throw new HttpException(
        'Transaction detail not found',
        HttpStatus.NOT_FOUND,
      );

    return transactionDetail;
  }

  async createAttachment(
    body: CreateAttachmentDto,
  ): Promise<TransactionDetailEntity> {
    const repo = this.transactionDetailRepository;

    const transactionDetail = repo.create({
      ...body,
      name: TransactionDetailEntity.types.ATTACHMENT,
    });

    const removeMeta = new TransactionDetailMetaEntity();

    removeMeta.name = 'remove';
    removeMeta.value = Date.now() % 2 ? 'never' : 'after-seen';
    removeMeta.transactionDetail = transactionDetail;

    const seenAtMeta = new TransactionDetailMetaEntity();

    seenAtMeta.name = 'seen_at';
    seenAtMeta.value = null;
    seenAtMeta.transactionDetail = transactionDetail;

    await repo.save(transactionDetail);

    await this.transactionDetailMetaRepository.save([removeMeta, seenAtMeta]);

    return transactionDetail;
  }

  async markAttachmentAsSeen(transactionId: string): Promise<any> {
    const transactionDetail = await this.transactionDetailRepository.findOne({
      where: {
        chainTransactionId: transactionId,
      },
    });

    if (!transactionDetail)
      throw new HttpException(
        'Transaction detail not found',
        HttpStatus.NOT_FOUND,
      );

    await this.transactionDetailMetaRepository.update(
      { name: 'seen_at', transactionDetail: transactionDetail },
      { value: Date.now() + '' },
    );

    return transactionDetail;
  }

  async deleteScheduledAttachments() {
    const timeThreshold =
      Date.now() -
      1000 *
        3600 *
        parseInt(this.configService.get('TRANSACTION_ATTACHMENT_TTL'));

    const query = `
      SELECT transactionDetailId FROM transaction_detail_meta tdm WHERE
      tdm.name = 'remove' AND
      tdm.value = 'after_seen' AND
      transactionDetailId IN(
          SELECT td.id AS id FROM transaction_details td
          INNER JOIN transaction_detail_meta tdm
          ON td.id = tdm.transactionDetailId
          WHERE td.name = 'attachment' AND tdm.name = 'seen_at' AND tdm.value < ?
      )
    `;

    const response = await this.transactionDetailRepository.query(query, [
      timeThreshold,
    ]);

    const ids = response.map(({ transactionDetailId }) => transactionDetailId);

    this.transactionDetailRepository.softDelete(ids);

    return true;
  }
}
