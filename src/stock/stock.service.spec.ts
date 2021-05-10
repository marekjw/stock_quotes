import { Test, TestingModule } from "@nestjs/testing"
import { getConnection } from "typeorm"
import { callbackManagerTest } from "./callbackManagers/callManTest"
import { CallbackManagerName } from "./constants"
import { Instrument } from "./instrument.entity"
import { StockService } from "./stock.service"
import { TypeOrmModule } from "@nestjs/typeorm";
import stockRecord from "./stockRecord.entity"
import ormconfig from "../ormconfig"


const tickerName = '_TEST'


async function deleteTestTickers(): Promise<void> {
    const connection = getConnection()
    await connection.getRepository(Instrument).query(`
        DELETE FROM instrument
        WHERE ticker='${tickerName}'
    `)
}

describe('Transaction tests', () => {
    let service: StockService

    beforeAll(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forFeature([stockRecord, Instrument]),
                TypeOrmModule.forRoot(ormconfig),
            ],
            providers: [
                {
                    provide: CallbackManagerName,
                    useClass: callbackManagerTest
                },
                StockService,
            ]
        }).compile()
        service = app.get<StockService>(StockService)
        await deleteTestTickers()
    })

    afterAll(async () => {
        await deleteTestTickers()
        await getConnection().close()
    })

    it('should create only one ticker', async () => {

        const insertFunc = async () => {
            return service.addRecord({
                ticker: tickerName,
                timestamp: 1,
                price: 10,
            }, 1000)
        }

        await Promise.all([insertFunc(), insertFunc()])
        const instruments = await service.getAllInstruments()
        // check if there is only one _TEST ticker created
        expect(instruments.filter(x => x === tickerName).length).toBe(1)
    })
})