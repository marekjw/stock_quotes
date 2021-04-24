import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";

const ormconfig: SqliteConnectionOptions = {
    type: 'sqlite',
    database: 'stockDB',
    entities: ['dist/src/**/*.entity.js'],
    synchronize: true,
}

export default ormconfig