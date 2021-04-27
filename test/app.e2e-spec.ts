import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { EntityMetadata, getConnection } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe())
    await app.init();
  });

  afterAll(async () => {

    const connection = getConnection()
    const entities = connection.entityMetadatas
    entities.forEach(async (entity) => {
      const repository = connection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    });
  })

  it('Posting valid data', () => {
    return request(app.getHttpServer())
      .post('/quotes')
      .send({
        timestamp: 10,
        price: 10,
        ticker: 'AAPL'
      })
      .expect(201)
  })

  it('Posting invalid price', () => {
    return request(app.getHttpServer())
      .post('/quotes')
      .send({
        timestamp: 10,
        price: '200 zł',
        ticker: 'AAPL'
      })
      .expect(400)
  })

  it('Posting empty object', () => {
    return request(app.getHttpServer())
      .post('/quotes')
      .send({
      })
      .expect(400)
  })

  it('Too long ticker name', () => {
    return request(app.getHttpServer())
      .post('/quotes')
      .send({
        timestamp: 10,
        price: 200,
        ticker: 'aaaaaaaaa'
      })
      .expect(400)
  })

  it('negative timestamp', () => {
    return request(app.getHttpServer())
      .post('/quotes')
      .send({
        timestamp: -110,
        price: 200,
        ticker: 'AAPL'
      })
      .expect(400)
  })

  test.concurrent.each(Array.from(Array(100).keys()))('POSTing new record %d', (i) => {
    return request("localhost:8000")
      .post('/quotes')
      .send({
        timestamp: i,
        price: 100,
        ticker: 'abc' + Math.floor(i / 10),
      })
      .expect(201)
  })
});
