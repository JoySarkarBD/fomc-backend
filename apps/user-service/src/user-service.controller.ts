import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserServiceService } from './user-service.service';

@Controller('users')
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userServiceService.create(dto);
  }

  @Get()
  findAll() {
    return this.userServiceService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userServiceService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateUserDto) {
    return this.userServiceService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userServiceService.remove(id);
  }
}
