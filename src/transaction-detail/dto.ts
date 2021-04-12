import { IsNotEmpty } from 'class-validator';

export class CreateAttachmentDto {
  @IsNotEmpty()
  chainTransactionId: string;

  @IsNotEmpty()
  deviceId: string;

  @IsNotEmpty()
  value: string;
}
