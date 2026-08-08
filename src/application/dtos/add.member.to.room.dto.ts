import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from 'node_modules/@nestjs/swagger/dist/decorators/api-property.decorator';

export class CreateMemberInRoomDto {
  @ApiProperty({ example: 'Alice', description: 'The name of the member in the room. Must be a non-empty string.' })
  @IsString()
    @IsNotEmpty()
    member!: string;
}