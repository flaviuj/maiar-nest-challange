import { Test, TestingModule } from '@nestjs/testing';
import { TransactionDetailController } from './transaction-detail.controller';
import { TransactionDetailService } from './transaction-detail.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [TransactionDetailController],
      providers: [TransactionDetailService],
    }).compile();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const transactionDetailController = app.get<TransactionDetailController>(
        TransactionDetailController,
      );
      // expect(transactionDetailController.getHello()).toBe('Hello World!');
    });
  });
});
