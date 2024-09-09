import { IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";
import mongoose from "mongoose";
import { BookingStatusType } from "src/contain/booking";


export class CreateBookingDto {

    @IsMongoId()
    ticketId: mongoose.Schema.Types.ObjectId;
    @IsMongoId()
    userId: mongoose.Schema.Types.ObjectId;
    @IsNumber({}, { message: 'Quantity must be a number' })
    quantity: number;
}
export class ConfirmBookingDto {

    paymentId: string

    paymentMethod: string;

    paymentStatus: string;


}