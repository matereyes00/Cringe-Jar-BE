import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from 'node_modules/@nestjs/swagger/dist/decorators/api-property.decorator';

export class CreateRoomDto {
    @ApiProperty({ example: 'Group Name', description: 'A name given to a group space' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ example: '1234', description: 'A passcode to access the group space. Must be at least 4 characters long.' })
    @IsString()
    @MinLength(4, { message: 'Passcode must be at least 4 characters long' })
    passcode!: string;
}