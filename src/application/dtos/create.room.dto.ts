import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateRoomDto {
  @IsString()
    @IsNotEmpty()
    name!: string;

  @IsString()
    @MinLength(4, { message: 'Passcode must be at least 4 characters long' })
    passcode!: string;
}