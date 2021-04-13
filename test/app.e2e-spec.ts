import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

const delay = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true)
  }, 500);
})

describe('TransactionDetailController (e2e)', () => {

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should respond with a list of all transaction details', async () => {

    const response = await request(app.getHttpServer()).get('/transaction-details');

    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should respond with a paginated list of all transaction details', async () => {

    const tda1 = await request(app.getHttpServer()).post('/transaction-details/attachment').send({
      chainTransactionId: `transaction-${Date.now()}`,
      deviceId: `device_${Date.now()}`,
      value: "encrypted_content"
    });

    expect(tda1.status).toBe(201);

    await delay();

    const tda2 = await request(app.getHttpServer()).post('/transaction-details/attachment').send({
      chainTransactionId: `transaction-${Date.now()}`,
      deviceId: `device_${Date.now()}`,
      value: "encrypted_content"
    });

    expect(tda2.status).toBe(201);

    await delay();

    const tda3 = await request(app.getHttpServer()).post('/transaction-details/attachment').send({
      chainTransactionId: `transaction-${Date.now()}`,
      deviceId: `device_${Date.now()}`,
      value: "encrypted_content"
    });

    expect(tda3.status).toBe(201);

    await delay();

    const response = await request(app.getHttpServer()).get('/transaction-details').query({ page: 1, limit: 3 });

    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(3);
  });

  it('should create a new transaction detail attachment, find it by chainTransactionId, mark it as seen', async () => {

    const now = Date.now();

    const newTrasanctionDetailAttachmentBody = {
      chainTransactionId: `transaction-${now}`,
      deviceId: `device_${now}`,
      value: "encrypted_content"
    }

    const createResponse = await request(app.getHttpServer()).post('/transaction-details/attachment').send(newTrasanctionDetailAttachmentBody);

    expect(createResponse.headers['content-type']).toMatch(/application\/json/);
    expect(createResponse.status).toBe(201);
    expect(createResponse.body.chainTransactionId).toBe(newTrasanctionDetailAttachmentBody.chainTransactionId);

    const getResponse = await request(app.getHttpServer()).get(`/transaction-details/${newTrasanctionDetailAttachmentBody.chainTransactionId}`);

    expect(getResponse.headers['content-type']).toMatch(/application\/json/);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.chainTransactionId).toBe(newTrasanctionDetailAttachmentBody.chainTransactionId);

    const seenResponse = await request(app.getHttpServer()).post(`/transaction-details/mark-attachment-as-seen/${newTrasanctionDetailAttachmentBody.chainTransactionId}`);

    expect(seenResponse.headers['content-type']).toMatch(/application\/json/);
    expect(seenResponse.status).toBe(200);
    expect(seenResponse.body.chainTransactionId).toBe(newTrasanctionDetailAttachmentBody.chainTransactionId);

  });

  it('should not find a transaction detail', async () => {

    const response = await request(app.getHttpServer()).get('/transaction-details/random-transaction-id');

    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.status).toBe(404);
  });

  it('should not find a transaction detail to mark attachment as seen', async () => {

    const seenResponse = await request(app.getHttpServer()).get('/transaction-details/mark-attachment-as-seen/random-transaction-id');

    expect(seenResponse.headers['content-type']).toMatch(/application\/json/);
    expect(seenResponse.status).toBe(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
