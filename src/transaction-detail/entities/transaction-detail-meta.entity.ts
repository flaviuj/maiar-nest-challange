import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionDetailEntity } from './transaction-detail.entity';

@Entity('transaction_detail_meta')
export class TransactionDetailMetaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    default: null,
  })
  value: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne((type) => TransactionDetailEntity, (td) => td.metas)
  transactionDetail: TransactionDetailEntity;
}
