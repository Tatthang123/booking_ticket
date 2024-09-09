import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";
export class CreateTicketDto {
    @IsString()
    nameTicket: string
    @IsNotEmpty()
    price: number
    @IsNotEmpty()
    totalTicket: number
    @IsNotEmpty()
    remaining: number
}
