import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TallyLog } from '../../../domain/entities/tally.log.entity';

@Injectable()
export class TallyLogRepository {
  constructor(
    @InjectRepository(TallyLog)
    private readonly repository: Repository<TallyLog>,
  ) {}

  create(data: Partial<TallyLog>): TallyLog {
    return this.repository.create(data);
  }

  async save(log: TallyLog): Promise<TallyLog> {
    return await this.repository.save(log);
  }

  async findByIdAndRoom(
    tallyId: string,
    roomId: string,
  ): Promise<TallyLog | null> {
    return await this.repository.findOne({
      where: {
        id: tallyId,
        room: { id: roomId },
      },
    });
  }

  async remove(log: TallyLog): Promise<TallyLog> {
    return await this.repository.remove(log);
  }

  async findByRoomAndMonth(
    roomId: string,
    year: number,
    month: number,
  ): Promise<TallyLog[]> {
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));

    return await this.repository
      .createQueryBuilder('tally')
      .where('tally.roomId = :roomId', { roomId })
      .andWhere('tally.timestamp >= :start', { start })
      .andWhere('tally.timestamp < :end', { end })
      .orderBy('tally.timestamp', 'DESC')
      .getMany();
  }

  async countByRoomAndMonth(
    roomId: string,
    year: number,
    month: number,
  ): Promise<Array<{ targetName: string; count: number }>> {
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));

    const rawResults = await this.repository
      .createQueryBuilder('tally')
      .select('tally.targetName', 'targetName')
      .addSelect('COUNT(*)', 'count')
      .where('tally.roomId = :roomId', { roomId })
      .andWhere('tally.timestamp >= :start', { start })
      .andWhere('tally.timestamp < :end', { end })
      .groupBy('tally.targetName')
      .orderBy('count', 'DESC')
      .getRawMany<{ targetName: string; count: string }>();

    return rawResults.map((row) => ({
      targetName: row.targetName,
      count: Number(row.count),
    }));
  }
}
