import { Body, Controller, Get, Post } from '@nestjs/common';
import { StockService } from './stock.service';
import { stockType } from './stockRecord.model';


@Controller()
export class StockController {
    constructor(private readonly stockService: StockService) { }

    @Post('/quotes')
    addStockQuote(
        @Body('ticker') ticker: string,
        @Body('timestamp') timeStamp: number,
        @Body('price') price: number) {
        return this.stockService.addRecord(ticker, timeStamp, price)
    }

    @Get('/instruments')
    async getAllInstuments(): Promise<{ instruments: string[]; }> {
        return { instruments: await this.stockService.getAllInstruments() };
    }

    @Get('/quotes')
    getHistory(): { history: stockType[] } {
        return { history: this.stockService.getStockHistory() };
    }

}
