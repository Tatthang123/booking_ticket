import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }
  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto
    const IsEmail = await this.userModel.findOne({ email })
    if (IsEmail) {
      throw new BadRequestException('Email tồn tại , vui lòng chọn email khác')
    }
    const newUser = await this.userModel.create({
      email: createUserDto.email,
      name: createUserDto.name,
      password: createUserDto.password,
      andress: createUserDto.andress
    })
    return newUser
  }
}
