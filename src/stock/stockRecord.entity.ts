import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Instrument } from "./instrument.entity";

@Entity('stockRecord')
export default class stockRecord {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'int' })
    price: number

    @Column({ type: 'int' })
    timestamp: number

    @ManyToOne(() => Instrument, { onDelete: 'CASCADE' })
    instrument: Instrument
}