import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from 'node_modules/@nestjs/swagger/dist/decorators/api-property.decorator';

export class AddTallyDto {
  @ApiProperty({ example: 'Bob', description: 'The name of the person being tallied' })
    @IsString()
    @IsNotEmpty()
    targetName!: string;

    @ApiProperty({ example: 'Bob did something cool', description: 'A description of the tally action' })
    @IsString()
    @IsNotEmpty()
    description!: string;
}