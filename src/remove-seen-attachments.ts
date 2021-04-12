import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransactionDetailService } from './transaction-detail/transaction-detail.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const transactionDetailService = app.get(TransactionDetailService);

  await transactionDetailService.deleteScheduledAttachments();
}
bootstrap();
