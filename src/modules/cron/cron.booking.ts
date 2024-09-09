import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BookingService } from '../booking/booking.service';


@Injectable()
export class BookingScheduler {
    constructor(private readonly bookingService: BookingService) { }


}