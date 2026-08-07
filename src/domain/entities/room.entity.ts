import { Entity, Column, PrimaryColumn, OneToMany, CreateDateColumn } from 'typeorm';
import {TallyLog} from './tally.log.entity';

@Entity('rooms')
export class Room {
  @PrimaryColumn()
  id!: string; // 6-character room code (e.g., "CRINGE")

  @Column()
  name!: string;

  @Column()
  passcode!: string;

  @Column('jsonb', { default: {} })
  scores!: Record<string, number>; // Format: { "Alex": 5, "Sam": 2 }

  @OneToMany(() => TallyLog, (log) => log.room, { cascade: true })
  history!: TallyLog[]; // TypeORM needs this property name to match the key in relations

  @CreateDateColumn()
  createdAt!: Date;
}