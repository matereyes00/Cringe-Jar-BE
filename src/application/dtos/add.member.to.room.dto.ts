import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMemberInRoomDto {
  @IsString()
    @IsNotEmpty()
    member!: string;
}