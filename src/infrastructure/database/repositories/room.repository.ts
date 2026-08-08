import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../../../domain/entities/room.entity';

@Injectable()
export class RoomRepository {
  constructor(
    @InjectRepository(Room)
    private readonly repository: Repository<Room>,
  ) {}

  create(data: Partial<Room>): Room {
    return this.repository.create(data);
  }

  async save(room: Room): Promise<Room> {
    return await this.repository.save(room);
  }

  async findWithHistory(roomId: string): Promise<Room | null> {
    return await this.repository.findOne({
      where: { id: roomId },
      relations: {
        history: true,
      },
      order: { history: { timestamp: 'DESC' } },
    });
  }
}
