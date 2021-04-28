import { Body, Controller, Get, Post } from '@nestjs/common';
import { StockService } from './stock.service';
import { stockType } from './stockType.model';


@Controller()
export class StockController {
    constructor(private readonly stockService: StockService) { }

    @Post('/quotes')
    async addStockQuote(
        @Body() params: stockType) {
        return (await this.stockService.addRecord(params))
    }

    @Get('/instruments')
    async getAllInstuments(): Promise<{ instruments: string[]; }> {
        return { instruments: await this.stockService.getAllInstruments() };
    }

    @Get('/quotes')
    async getHistory(): Promise<{ history: stockType[]; }> {
        return { history: await this.stockService.getStockHistory() };
    }

}
