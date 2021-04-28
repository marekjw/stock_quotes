import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { EntityMetadata, getConnection } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const defaultName = 'abc'
  let expectedTable = ['AAPL']

  beforeAll(async () => {
    for (let i = 0; i < 10; ++i) expectedTable.push(defaultName + i)
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
    return request("localhost:8000")
      .post('/quotes')
      .send({
        timestamp: 100,
        price: 10,
        ticker: 'AAPL'
      })
      .expect(201)
  })

  it('Posting invalid price', () => {
    return request("localhost:8000")
      .post('/quotes')
      .send({
        timestamp: 10,
        price: '200 zł',
        ticker: 'AAPL'
      })
      .expect(400)
  })

  it('Posting empty object', () => {
    return request("localhost:8000")
      .post('/quotes')
      .send({
      })
      .expect(400)
  })

  it('Too long ticker name', () => {
    return request("localhost:8000")
      .post('/quotes')
      .send({
        timestamp: 10,
        price: 200,
        ticker: 'aaaaaaaaa'
      })
      .expect(400)
  })

  it('negative timestamp', () => {
    return request("localhost:8000")
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
        ticker: defaultName + Math.floor(i / 10),
      })
      .expect(201)
  })

  it('checking the instrument table', () => {
    return request("localhost:8000")
      .get('/instruments')
      .expect(200)
      .expect({
        instruments: expectedTable
      })
  })

  it('checking the qotes table', () => {
    return request("localhost:8000")
      .get('/quotes')
      .expect(200)
      .expect((res) => {
        let timestampCheck = Array(101)

        for (let i = 0; i <= 100; ++i) timestampCheck[i] = false;

        res.body.history.forEach(element => {
          timestampCheck[element.timestamp] = true;
        });

        for (let i = 0; i <= 100; ++i) {
          if (!timestampCheck[i]) throw new Error("Record with timestamp " + i + " not found")
        }
      })
  })


});
