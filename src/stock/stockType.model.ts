import { IsNotEmpty, IsNumber, IsPositive, IsString, Length, MaxLength } from "class-validator"

export class stockType {
    @IsNotEmpty()
    @IsString()
    @MaxLength(5)
    ticker: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    timestamp: number;
}