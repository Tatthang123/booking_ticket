import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { TicketStatusType } from "src/contain/ticket";
@Schema({ timestamps: true })
export class Ticket {
    @Prop()
    nameTicket: string
    @Prop({ required: true, min: 0 })
    price: number
    @Prop({ required: true, min: 0 })
    TotalTicket: number // tổng số vé ban đầu
    @Prop({ required: true, enum: TicketStatusType, default: TicketStatusType.AVAILABLE })
    status: TicketStatusType;
    @Prop({ required: true, min: 0 })
    remaining: number // số vé còn lại ban đầu bằng tổng số vé
}
export const TicketSchema = SchemaFactory.createForClass(Ticket);

