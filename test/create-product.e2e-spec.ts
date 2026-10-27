import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@/infra/app.module';

describe('Create Product (E2E)', () => {
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

  test('[POST] /product without token should return 401', async () => {
    const response = await request(app.getHttpServer()).post('/product').send({
      name: 'Produto Teste',
      description: 'Descrição',
      price: 10,
      categoryId: '00000000-0000-0000-0000-000000000000',
    });

    expect(response.statusCode).toBe(401);
  });

  test('[POST] /product with invalid body and without token should return 401', async () => {
    const response = await request(app.getHttpServer())
      .post('/product')
      .send({});

    expect(response.statusCode).toBe(401);
  });
});
