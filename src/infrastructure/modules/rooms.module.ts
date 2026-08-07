import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsController } from '../http/room.controller';
import { RoomsService } from '../../application/services/rooms.service';
import { Room } from '../../domain/entities/room.entity';
import { TallyLog } from 'src/domain/entities/tally.log.entity';
import { RoomRepository } from '../database/repositories/room.repository';
import { TallyLogRepository } from '../database/repositories/tally.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Room, TallyLog])],
  controllers: [RoomsController],
  providers: [RoomsService, RoomRepository, TallyLogRepository],
  exports: [RoomsService],
})
export class RoomsModule {}