import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Headers,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { RoomsService } from '../../application/services/rooms.service';
import { CreateRoomDto } from '../../application/dtos/create.room.dto';
import { AddTallyDto } from '../../application/dtos/add.tally.dto';
import { CreateMemberInRoomDto } from 'src/application/dtos/add.member.to.room.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('rooms') // Groups these routes together in the UI
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post('create-room')
  @ApiOperation({ summary: 'Create a new group room' })
  @ApiResponse({
    status: 201,
    description: 'The room has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  createRoom(@Body() dto: CreateRoomDto) {
    return this.roomsService.createRoom(dto);
  }

  @Get('get-room/:id')
  @ApiOperation({
    summary: 'View a specific group room using the existing group ID',
  })
  @ApiResponse({
    status: 200,
    description: 'The room has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid room passcode.',
  })
  getRoom(
    @Param('id') roomId: string,
    @Headers('x-passcode') passcode: string,
  ) {
    return this.roomsService.getRoom(roomId, passcode);
  }

  @Post(':id/add-member')
  @ApiOperation({ summary: 'Add a member to a specific group room' })
  @ApiResponse({
    status: 200,
    description: 'The member has been successfully added.',
  })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  async addMember(
    @Param('id') id: string,
    @Headers('x-passcode') passcode: string,
    @Body() dto: CreateMemberInRoomDto,
  ) {
    return await this.roomsService.addMember(id, passcode, dto);
  }

  @Post(':id/tally-member')
  @ApiOperation({
    summary: 'Add a tally to a member located in a specific group room',
  })
  @ApiResponse({
    status: 200,
    description: 'The tally has been successfully added.',
  })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid room passcode.',
  })
  addTally(
    @Param('id') roomId: string,
    @Headers('x-passcode') passcode: string,
    @Body() dto: AddTallyDto,
  ) {
    return this.roomsService.addTally(roomId, passcode, dto);
  }

  @Delete(':id/tallies/:tallyId')
  @ApiOperation({ summary: 'Delete/undo a tally' })
  @ApiResponse({
    status: 200,
    description: 'The tally has been successfully undone.',
  })
  @ApiResponse({ status: 404, description: 'Room or tally not found.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid room passcode.',
  })
  undoTally(
    @Param('id') roomId: string,
    @Param('tallyId') tallyId: string,
    @Headers('x-passcode') passcode: string,
  ) {
    return this.roomsService.undoTally(roomId, passcode, tallyId);
  }

  @Get(':id/leaderboard')
  @ApiOperation({
    summary: 'Get leaderboard counts for a room by year and month',
  })
  @ApiResponse({
    status: 200,
    description: 'The leaderboard has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid room passcode.',
  })
  getLeaderboard(
    @Param('id') roomId: string,
    @Headers('x-passcode') passcode: string,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    const yearNum = Number(year);
    const monthNum = Number(month);

    if (
      !year ||
      !month ||
      Number.isNaN(yearNum) ||
      Number.isNaN(monthNum) ||
      monthNum < 1 ||
      monthNum > 12
    ) {
      throw new BadRequestException(
        'year and month query parameters are required and must be valid numbers',
      );
    }

    return this.roomsService.getLeaderboard(
      roomId,
      passcode,
      yearNum,
      monthNum,
    );
  }

  @Get(':id/history')
  @ApiOperation({
    summary: 'Get tally log history for a room by year and month',
  })
  @ApiResponse({
    status: 200,
    description: 'The history has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid room passcode.',
  })
  getHistory(
    @Param('id') roomId: string,
    @Headers('x-passcode') passcode: string,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    const yearNum = Number(year);
    const monthNum = Number(month);

    if (
      !year ||
      !month ||
      Number.isNaN(yearNum) ||
      Number.isNaN(monthNum) ||
      monthNum < 1 ||
      monthNum > 12
    ) {
      throw new BadRequestException(
        'year and month query parameters are required and must be valid numbers',
      );
    }

    return this.roomsService.getHistory(roomId, passcode, yearNum, monthNum);
  }
}
