import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RoomRepository } from '../../infrastructure/database/repositories/room.repository';
import { TallyLogRepository } from '../../infrastructure/database/repositories/tally.repository';
import { Room } from '../../domain/entities/room.entity';
import { CreateRoomDto } from '../dtos/create.room.dto';
import { AddTallyDto } from '../dtos/add.tally.dto';
import { CreateMemberInRoomDto } from '../dtos/add.member.to.room.dto';

type SafeRoom = Omit<Room, 'passcode'>;

@Injectable()
export class RoomsService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly logRepository: TallyLogRepository,
  ) {}

  async createRoom(dto: CreateRoomDto): Promise<SafeRoom> {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const room = this.roomRepository.create({
      id: roomId,
      name: dto.name,
      passcode: dto.passcode,
      scores: {},
    });
    const savedRoom = await this.roomRepository.save(room);
    return this.toSafeRoom(savedRoom);
  }

  async getRoom(roomId: string, passcode: string): Promise<SafeRoom> {
    const room = await this.getAuthenticatedRoom(roomId, passcode);
    return this.toSafeRoom(room);
  }

  private async getAuthenticatedRoom(
    roomId: string,
    passcode: string,
  ): Promise<Room> {
    const room = await this.roomRepository.findWithHistory(roomId);

    if (!room) throw new NotFoundException('Room not found');
    if (room.passcode !== passcode)
      throw new UnauthorizedException('Invalid room passcode');

    return room;
  }

  private toSafeRoom(room: Room): SafeRoom {
    const { passcode, ...safeRoom } = room;
    void passcode;
    return safeRoom;
  }

  async addTally(
    roomId: string,
    passcode: string,
    dto: AddTallyDto,
  ): Promise<SafeRoom> {
    const room = await this.getAuthenticatedRoom(roomId, passcode);

    const scores = room.scores || {};

    if (!(dto.targetName in scores)) {
      throw new NotFoundException(
        `Member '${dto.targetName}' is not in this room`,
      );
    }

    scores[dto.targetName] += 1;
    room.scores = scores;

    await this.roomRepository.save(room);

    const log = this.logRepository.create({
      targetName: dto.targetName,
      description: dto.description,
      room,
    });

    await this.logRepository.save(log);

    return this.getRoom(roomId, passcode);
  }

  async undoTally(
    roomId: string,
    passcode: string,
    tallyId: string,
  ): Promise<SafeRoom> {
    const room = await this.getAuthenticatedRoom(roomId, passcode);
    const tally = await this.logRepository.findByIdAndRoom(tallyId, roomId);

    if (!tally) {
      throw new NotFoundException('Tally not found in this room');
    }

    const scores = room.scores || {};
    if (!(tally.targetName in scores)) {
      throw new NotFoundException(
        `Member '${tally.targetName}' is not in this room`,
      );
    }

    scores[tally.targetName] = Math.max(0, scores[tally.targetName] - 1);
    room.scores = scores;

    await this.roomRepository.save(room);
    await this.logRepository.remove(tally);

    return this.getRoom(roomId, passcode);
  }

  async getLeaderboard(
    roomId: string,
    passcode: string,
    year: number,
    month: number,
  ) {
    const room = await this.getAuthenticatedRoom(roomId, passcode);

    const monthlyCounts = await this.logRepository.countByRoomAndMonth(
      roomId,
      year,
      month,
    );

    const countMap = new Map(
      monthlyCounts.map((entry) => [entry.targetName, entry.count]),
    );

    const scores = Object.keys(room.scores || {})
      .map((name) => ({
        name,
        count: countMap.get(name) ?? 0,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      year,
      month,
      scores,
    };
  }

  async getHistory(
    roomId: string,
    passcode: string,
    year: number,
    month: number,
  ) {
    await this.getAuthenticatedRoom(roomId, passcode);

    const logs = await this.logRepository.findByRoomAndMonth(
      roomId,
      year,
      month,
    );

    return {
      year,
      month,
      logs: logs.map((log) => ({
        id: log.id,
        targetName: log.targetName,
        description: log.description,
        timestamp: log.timestamp,
      })),
    };
  }

  async addMember(
    roomId: string,
    passcode: string,
    dto: CreateMemberInRoomDto,
  ): Promise<SafeRoom> {
    const room = await this.getAuthenticatedRoom(roomId, passcode);
    const scores = room.scores || {};

    // Optional: Prevent duplicate member additions
    if (dto.member in scores) {
      throw new ConflictException(
        `Member '${dto.member}' is already in this room`,
      );
    }

    // Initialize member with 0 tallies
    scores[dto.member] = 0;
    room.scores = scores;

    const savedRoom = await this.roomRepository.save(room);
    return this.toSafeRoom(savedRoom);
  }
}
