import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { Instrument } from "./instrument.entity";
import stockRecord from "./stockRecord.entity";
import { StockController } from "./stock.controller";
import { StockService } from "./stock.service";
import { callbackManagerProd } from "./callbackManagers/callbackManagerProd";
import { CallbackManagerName } from "./constants";


@Module({
    imports: [TypeOrmModule.forFeature([stockRecord, Instrument])],
    controllers: [StockController],
    providers: [StockService,
        { provide: CallbackManagerName, useClass: callbackManagerProd }
    ]
})
export class StockModule { }