import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { TransactionDetailMetaEntity } from './transaction-detail-meta.entity';

export enum Types {
  ATTACHMENT = 'attachment',
  SECONDARY_ATTACHMENT = 'secondary_attachment',
}

@Entity('transaction_details')
export class TransactionDetailEntity {
  static types = Types;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: null,
  })
  chainTransactionId: string;

  @Column({
    default: null,
  })
  deviceId: string;

  @Column({
    type: 'enum',
    enum: Types,
    default: null,
  })
  name: Types;

  @Column({
    default: null,
  })
  value: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;

  @OneToMany(
    (type) => TransactionDetailMetaEntity,
    (tdm) => tdm.transactionDetail,
  )
  metas: TransactionDetailMetaEntity[];
}
