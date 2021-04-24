import { Column, Entity, ManyToOne } from "typeorm";
import { Instrument } from "./instrument.entity";

@Entity()
export default class stockRecord {
    @Column({ type: 'int' })
    price: number

    @Column({ type: 'timestamp' })
    timestamp: number

    @ManyToOne(() => Instrument)
    instrument: Instrument
}