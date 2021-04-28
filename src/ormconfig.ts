require('dotenv').config();

const ormconfig: any = {
    type: 'postgres',
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,

    entities: ["dist/**/*.entity.js"],
    migrationsTableName: 'migration',

    autoLoadEntities: true,

    synchronize: true,
}

export default ormconfig