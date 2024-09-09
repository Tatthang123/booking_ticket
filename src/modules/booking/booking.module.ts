import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TicketModule } from '../ticket/ticket.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from '../ticket/schema/ticket.schema';
import { Booking, BookingSchema } from './schema/booking.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
  MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule { }
