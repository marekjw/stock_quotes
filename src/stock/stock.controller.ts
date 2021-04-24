import { Body, Controller, Get, Post } from '@nestjs/common';
import { StockService } from './stock.service';
import { stockRecord } from './stockRecord.model';


@Controller()
export class StockController {
    constructor(private readonly stockService: StockService) { }

    @Post('/quotes')
    addStockQuote(
        @Body('ticker') ticker: string,
        @Body('timestamp') timeStamp: number,
        @Body('price') price: number) {
        this.stockService.addRecord(ticker, timeStamp, price)
    }

    @Get('/instruments')
    getAllInstuments(): { instruments: string[] } {
        return { instruments: this.stockService.getAllInstruments() };
    }

    @Get('/history')
    getHistory(): { history: stockRecord[] } {
        return { history: this.stockService.getStockHistory() };
    }

}
