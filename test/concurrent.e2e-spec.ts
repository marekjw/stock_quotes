import * as request from 'supertest';

describe('Transaction testing', () => {

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


})