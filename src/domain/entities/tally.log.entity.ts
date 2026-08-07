import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity('tally_logs')
export class TallyLog {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  @Column()
    targetName!: string;

  @Column()
    description!: string;

  @CreateDateColumn()
    timestamp!: Date;

  @ManyToOne(() => Room, (room) => room.history, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'roomId' })
    room!: Room;
}