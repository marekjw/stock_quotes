import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { timeStamp } from 'node:console';
import { Connection, createQueryBuilder } from 'typeorm';
import { Instrument } from './instrument.entity';
import stockRecord from './stockRecord.entity';
import { stockType } from './stockType.model';

@Injectable()
export class StockService {
    constructor(private connection: Connection) { }

    async addRecord(ticker: string, timestamp: number, price: number) {
        const queryRunner = this.connection.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            let instrument = await queryRunner.manager.findOne(Instrument, { ticker: ticker })
            if (instrument === undefined)
                instrument = (await queryRunner.manager.insert(Instrument, { ticker: ticker })).raw

            await queryRunner.manager.insert(stockRecord, {
                timestamp: timestamp,
                price: price,
                instrument: instrument
            })
            await queryRunner.commitTransaction()
        } catch (err) {
            queryRunner.rollbackTransaction()
            console.error(err)
            throw new InternalServerErrorException("Could not create stock record")
        } finally {
            queryRunner.release()
        }
    }

    async getStockHistory(): Promise<stockType[]> {
        try {
            return createQueryBuilder('stockRecord')
                .leftJoinAndSelect('stockRecord.instrument', 'instrument')
                .select(['instrument.ticker as ticker', 'stockRecord.price AS price', 'stockRecord.timestamp as timestamp'])
                .getRawMany()
        } catch (err) {
            console.error(err)
            throw new InternalServerErrorException('Could not get stock records')
        }
    }


    async getAllInstruments(): Promise<string[]> {
        const queryRunner = this.connection.createQueryRunner()
        await queryRunner.connect()
        const res = (await queryRunner.manager.find(Instrument, { order: { ticker: 'ASC' } })).map(el => el.ticker)
        await queryRunner.release()
        return res
    }
}
