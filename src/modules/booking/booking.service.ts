import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfirmBookingDto, CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from '../ticket/schema/ticket.schema';
import { Model } from 'mongoose';
import { Booking } from './schema/booking.schema';
import { TicketStatusType } from 'src/contain/ticket';
import { BookingStatusType } from 'src/contain/booking';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BookingService {

  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    @InjectModel(Booking.name) private bookingModel: Model<Booking>) { }
  //API BOOKING
  async create(createBookingDto: CreateBookingDto) {
    const { ticketId, userId, quantity } = createBookingDto;

    const quantityNumber = Number(quantity);

    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      throw new BadRequestException('Quantity must be a positive number');
    }

    const session = await this.ticketModel.startSession();
    session.startTransaction();

    try {
      const ticket = await this.ticketModel.findById(ticketId).session(session);
      if (!ticket) {
        throw new NotFoundException('Ticket not found');
      }
      if (ticket.status !== TicketStatusType.AVAILABLE) {
        throw new BadRequestException('Ticket is not available for booking');
      }
      if (ticket.remaining < quantityNumber) {
        throw new BadRequestException('Not enough tickets available');
      }
      await this.ticketModel.updateOne(
        { _id: ticketId, remaining: { $gte: quantityNumber } },
        {
          $inc: { remaining: -quantityNumber },
          $set: {
            status: ticket.remaining === quantityNumber ? TicketStatusType.BOOKED : ticket.status
          }
        }
      ).session(session);
      const booking = new this.bookingModel({
        ticketId,
        userId,
        quantity: quantityNumber,
        totalAmount: ticket.price * quantityNumber,
      });

      await booking.save({ session });

      await session.commitTransaction();
      session.endSession();

      return booking;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
  //
  async findAll() {
    return await this.bookingModel.find({})
  }
  //CORNFIRM BOOKING
  async confirmBooking(bookingId: string, confirmBookingDto: ConfirmBookingDto) {

    const booking = await this.bookingModel.findById(bookingId).populate('ticketId');
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BookingStatusType.PENDING) {
      throw new BadRequestException('Booking cannot be confirmed');
    }
    if (confirmBookingDto.paymentStatus !== 'success') {
      throw new BadRequestException('Payment was not successful');
    }
    booking.status = BookingStatusType.CORNFIRMED;
    booking.paymentId = confirmBookingDto.paymentId;
    booking.paymentMethod = confirmBookingDto.paymentMethod;
    booking.paymentStatus = confirmBookingDto.paymentStatus;

    return booking.save()
  }
  //REFUND MONEY
  async refundBooking(bookingId: string) {
    const booking = await this.bookingModel.findById(bookingId).populate('ticketId');
    if (!booking) {
      throw new NotFoundException('booking not found');
    }
    if (booking.status !== BookingStatusType.CORNFIRMED) {
      throw new BadRequestException('only confirmed bookings can be canceled');
    }
    const refundMoney = booking.totalAmount * 0.9;
    booking.refundMoney = refundMoney
    booking.status = BookingStatusType.CANCEL

    await this.ticketModel.updateOne(
      { _id: booking.ticketId },
      {
        $inc: { remaining: booking.quantity },
        $set: {
          status: TicketStatusType.AVAILABLE
        }
      }
    );
    booking.save()
    return {
      messeage: "Booking canceled successfully",
      booking
    }

  }
  //AUTO CANCEL TICKET PENDING
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handlePendingBookings() {
    const now = new Date();
    const confirmationDeadline = new Date(now.getTime() - 5 * 60 * 1000);

    const pendingBookings = await this.bookingModel.find({
      status: BookingStatusType.PENDING,
      createdAt: { $lte: confirmationDeadline },
    }).populate('ticketId');

    for (const booking of pendingBookings) {
      booking.status = BookingStatusType.CANCEL;
      await booking.save();
      await this.ticketModel.updateOne(
        { _id: booking.ticketId },
        {
          $inc: { remaining: booking.quantity },
          $set: {
            status: TicketStatusType.AVAILABLE
          }
        }
      );
    }
  }

}






