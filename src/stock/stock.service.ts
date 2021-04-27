import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Connection, createQueryBuilder } from 'typeorm';
import { Instrument } from './instrument.entity';
import stockRecord from './stockRecord.entity';
import { stockType } from './stockType.model';

@Injectable()
export class StockService {
    constructor(private connection: Connection) { }

    async addRecord(record: stockType) {
        const queryRunner = this.connection.createQueryRunner()
        await queryRunner.connect()
        let instrument: any

        let nAttempts = 5;
        while (true) {
            await queryRunner.startTransaction()
            try {
                instrument = await queryRunner.manager.findOne(Instrument, { ticker: record.ticker })
                if (instrument == undefined)
                    instrument = (await queryRunner.manager.insert(Instrument, { ticker: record.ticker })).raw[0]

                await queryRunner.commitTransaction()
                break;
            } catch (err) {
                await queryRunner.rollbackTransaction()
                if (--nAttempts <= 0) {
                    queryRunner.release()
                    throw new InternalServerErrorException("Could not create stock record")
                }
            }
        }

        await queryRunner.manager.insert(stockRecord, {
            timestamp: record.timestamp,
            price: record.price,
            instrument: instrument
        })
        queryRunner.release()
    }

    async getStockHistory(): Promise<stockType[]> {
        try {
            return createQueryBuilder('stockRecord')
                .leftJoinAndSelect('stockRecord.instrument', 'instrument')
                .select(['instrument.ticker as ticker', 'stockRecord.price AS price', 'stockRecord.timestamp as timestamp'])
                .getRawMany()
        } catch (err) {
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
