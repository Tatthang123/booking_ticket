import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './schema/ticket.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class TicketService {
  constructor(@InjectModel(Ticket.name) private ticketModel: Model<Ticket>) { }

  async create(createTicketDto: CreateTicketDto) {
    const nameTicket = createTicketDto.nameTicket
    const IsTicket = await this.ticketModel.findOne({ nameTicket })
    if (IsTicket) {
      throw new BadRequestException('Vé đã tồn tại')
    }
    const newTicket = await this.ticketModel.create({
      nameTicket: createTicketDto.nameTicket,
      price: createTicketDto.price,
      TotalTicket: createTicketDto.totalTicket,
      remaining: createTicketDto.remaining
    })
    return newTicket

  }
  async findAll() {
    return await this.ticketModel.find({ status: 'available' }).exec();
  }


}
