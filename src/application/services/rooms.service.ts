import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RoomRepository } from '../../infrastructure/database/repositories/room.repository';
import { TallyLogRepository } from '../../infrastructure/database/repositories/tally.repository';
import { Room } from '../../domain/entities/room.entity';
import { CreateRoomDto } from '../dtos/create.room.dto';
import { AddTallyDto } from '../dtos/add.tally.dto';
import { CreateMemberInRoomDto } from '../dtos/add.member.to.room.dto';

@Injectable()
export class RoomsService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly logRepository: TallyLogRepository,
  ) {}

  async createRoom(dto: CreateRoomDto): Promise<Room> {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const room = this.roomRepository.create({
      id: roomId,
      name: dto.name,
      passcode: dto.passcode,
      scores: {},
    });
    return await this.roomRepository.save(room);
  }

  async getRoom(roomId: string, passcode: string): Promise<Room> {
    const room = await this.roomRepository.findWithHistory(roomId);

    if (!room) throw new NotFoundException('Room not found');
    if (room.passcode !== passcode) throw new UnauthorizedException('Invalid room passcode');

    return room;
  }

  async addTally(roomId: string, passcode: string, dto: AddTallyDto): Promise<Room> {
    const room = await this.getRoom(roomId, passcode);

    // Update target tally score
    const scores = room.scores || {};
    scores[dto.targetName] = (scores[dto.targetName] || 0) + 1;
    room.scores = scores;

    // Save event history log
    const log = this.logRepository.create({
      targetName: dto.targetName,
      description: dto.description,
      room,
    });

    await this.logRepository.save(log);
    await this.roomRepository.save(room);

    return this.getRoom(roomId, passcode);
  }

  async addMember(roomId: string, passcode: string, dto: CreateMemberInRoomDto): Promise<Room> {
  const room = await this.getRoom(roomId, passcode);
  const scores = room.scores || {};

  // Optional: Prevent duplicate member additions
  if (dto.member in scores) {
    throw new ConflictException(`Member '${dto.member}' is already in this room`);
  }

  // Initialize member with 0 tallies
  scores[dto.member] = 0;
  room.scores = scores;

  return await this.roomRepository.save(room);
}
}