import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { stockRecord } from './stockRecord.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('/quotes')
  addStockQuote(
    @Body('ticker') ticker: string,
    @Body('timestamp') timeStamp: number,
    @Body('price') price: number) {
    this.appService.addRecord(ticker, timeStamp, price)
  }

  @Get('/instruments')
  getAllInstuments(): { instruments: string[] } {
    return { instruments: this.appService.getAllInstruments() };
  }

  @Get('/history')
  getHistory(): { history: stockRecord[] } {
    return { history: this.appService.getStockHistory() };
  }

}
