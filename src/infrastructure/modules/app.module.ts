import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsModule } from './rooms.module';
import { Room } from '../../domain/entities/room.entity'
import { TallyLog } from '../../domain/entities/tally.log.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgrespassword',
      database: process.env.DB_NAME || 'cringe_db',
      entities: [Room, TallyLog],
      synchronize: true, // Automatically updates database schema in development
    }),
    RoomsModule,
  ],
})
export class AppModule {}