import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { Instrument } from "./instrument.entity";
import stockRecord from "./stockRecord.entity";
import { StockController } from "./stock.controller";
import { StockService } from "./stock.service";


@Module({
    imports: [TypeOrmModule.forFeature([stockRecord, Instrument])],
    controllers: [StockController],
    providers: [StockService]
})
export class StockModule { }