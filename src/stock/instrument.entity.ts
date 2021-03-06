import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('instrument')
export class Instrument {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
        length: 5,
        unique: true,
    })
    ticker: string
}