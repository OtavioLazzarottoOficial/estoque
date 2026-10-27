import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@/infra/app.module';

describe('Authenticate (E2E)', () => {
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

  test('[POST] /auth with invalid body should return 400', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth')
      .send({ email: 'invalid-email', password: '' });

    expect(response.statusCode).toBe(400);
  });

  test('[POST] /auth with non-existing user should return 404', async () => {
    const response = await request(app.getHttpServer()).post('/auth').send({
      email: 'naoexiste@teste.com',
      password: '12345678',
    });

    expect(response.statusCode).toBe(404);
  });
});
