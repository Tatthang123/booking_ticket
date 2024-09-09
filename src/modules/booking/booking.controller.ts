import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { ConfirmBookingDto, CreateBookingDto } from './dto/create-booking.dto';
import { Throttle } from '@nestjs/throttler';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Cron } from '@nestjs/schedule';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto,) {
    return await this.bookingService.create(createBookingDto);
  }
  @Get()
  async fillAll() {
    return await this.bookingService.findAll()
  }

  @Post('/cornfirm/:bookingId')
  async confirmBooking(
    @Param('bookingId') bookingId: string,
    @Body() confirmBookingDto: ConfirmBookingDto,
  ) {
    return this.bookingService.confirmBooking(bookingId, confirmBookingDto);
  }

  @Post('/cancel/:bookingId')
  async refundBooking(@Param('bookingId') bookingId: string,) {
    return await this.bookingService.refundBooking(bookingId)
  }


}
