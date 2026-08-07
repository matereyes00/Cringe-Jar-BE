import { Controller, Post, Get, Body, Param, Headers } from '@nestjs/common';
import { RoomsService } from '../../application/services/rooms.service';
import {CreateRoomDto} from '../../application/dtos/create.room.dto';
import { AddTallyDto } from '../../application/dtos/add.tally.dto';
import { CreateMemberInRoomDto } from 'src/application/dtos/add.member.to.room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  createRoom(@Body() dto: CreateRoomDto) {
    return this.roomsService.createRoom(dto);
  }

  @Get(':id')
  getRoom(
    @Param('id') roomId: string,
    @Headers('x-passcode') passcode: string,
  ) {
    return this.roomsService.getRoom(roomId, passcode);
  }

  @Post(':id/tally')
  addTally(
    @Param('id') roomId: string,
    @Headers('x-passcode') passcode: string,
    @Body() dto: AddTallyDto,
  ) {
    return this.roomsService.addTally(roomId, passcode, dto);
  }

  @Post(':id/members')
  async addMember(
    @Param('id') id: string,
    @Headers('x-passcode') passcode: string,
    @Body() dto: CreateMemberInRoomDto,
  ) {
    return await this.roomsService.addMember(id, passcode, dto);
  }
}