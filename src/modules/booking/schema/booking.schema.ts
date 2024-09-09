import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { BookingStatusType } from "src/contain/booking";
import { Ticket } from "src/modules/ticket/schema/ticket.schema";
import { User } from "src/modules/user/schema/user.schema";
@Schema({ timestamps: true })
export class Booking {
    @Prop({ type: Types.ObjectId, ref: 'Ticket', required: true })
    ticketId: Ticket;
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: User
    @Prop({ required: true, min: 1 })
    quantity: number;
    @Prop({ required: true, min: 0 })
    totalAmount: number;
    @Prop({ required: true, enum: BookingStatusType, default: BookingStatusType.PENDING })
    status: BookingStatusType;
    @Prop()
    refundMoney: number
    @Prop()
    createdAt: Date
    @Prop()
    updatedAt: Date
    @Prop()
    paymentId?: string;

    @Prop()
    paymentMethod?: string;

    @Prop()
    paymentStatus?: string;


}
export const BookingSchema = SchemaFactory.createForClass(Booking);