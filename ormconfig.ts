import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";

const ormconfig: any = {
    type: 'sqlite',
    database: 'stockDB',
    autoLoadEntities: true,
    synchronize: true,
}

export default ormconfig