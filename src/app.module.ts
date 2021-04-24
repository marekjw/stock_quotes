import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from 'ormconfig';
import { StockModule } from './stock/stock.module';


@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), StockModule],
})
export class AppModule { }
