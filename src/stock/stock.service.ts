import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Connection, createQueryBuilder } from 'typeorm';
import { callbackManager } from './callbackManagers/callbackManager.interface';
import { CallbackManagerName } from './constants';
import { Instrument } from './instrument.entity';
import stockRecord from './stockRecord.entity';
import { stockType } from './stockType.model';

@Injectable()
export class StockService {
    constructor(private connection: Connection, @Inject(CallbackManagerName) private callbacks: callbackManager) { }

    async addRecord(record: stockType, ...args: any[]) {
        const queryRunner = this.connection.createQueryRunner()
        await queryRunner.connect()
        let instrument: any

        let nAttempts = 5;
        while (true) {
            await queryRunner.startTransaction('SERIALIZABLE')
            try {
                instrument = await queryRunner.manager.findOne(Instrument, { ticker: record.ticker })

                this.callbacks.onInsert(...args)

                if (instrument == undefined)
                    instrument = (await queryRunner.manager.insert(Instrument, { ticker: record.ticker })).raw[0]

                await queryRunner.commitTransaction()
                break;
            } catch (err) {
                console.log(err)
                await queryRunner.rollbackTransaction()
                if (--nAttempts <= 0) {
                    queryRunner.release()
                    throw new InternalServerErrorException("Could not create stock record")
                }
            }
        }

        const res = (await queryRunner.manager.insert(stockRecord, {
            timestamp: record.timestamp,
            price: record.price,
            instrument: instrument
        })).raw[0].id
        queryRunner.release()
        return res
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
