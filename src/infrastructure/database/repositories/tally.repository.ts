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
}