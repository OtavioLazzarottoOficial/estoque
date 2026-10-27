import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@/infra/app.module';

describe('Stock Movements (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[POST] /stock/increase without token should return 401', async () => {
    const response = await request(app.getHttpServer())
      .post('/stock/increase')
      .send({ stockId: '00000000-0000-0000-0000-000000000000', quantity: 1 });

    expect(response.statusCode).toBe(401);
  });

  test('[POST] /stock/decrease without token should return 401', async () => {
    const response = await request(app.getHttpServer())
      .post('/stock/decrease')
      .send({ stockId: '00000000-0000-0000-0000-000000000000', quantity: 1 });

    expect(response.statusCode).toBe(401);
  });
});
