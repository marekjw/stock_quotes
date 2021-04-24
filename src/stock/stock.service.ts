import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Instrument } from './instrument.entity';
import { stockRecord } from './stockRecord.model';

@Injectable()
export class StockService {
    constructor(private connection: Connection) { }

    addRecord(ticker: string, timestamp: number, price: number) {

    }

    getStockHistory(): stockRecord[] {
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
