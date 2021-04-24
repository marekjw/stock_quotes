import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { timeStamp } from 'node:console';
import { Connection } from 'typeorm';
import { Instrument } from './instrument.entity';
import stockRecord from './stockRecord.entity';
import { stockType } from './stockRecord.model';

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

    getStockHistory(): stockType[] {
        return []
    }


    async getAllInstruments(): Promise<string[]> {
        const queryRunner = this.connection.createQueryRunner()
        await queryRunner.connect()
        const res = (await queryRunner.manager.find(Instrument)).map(el => el.ticker)
        await queryRunner.release()
        return res
    }
}
