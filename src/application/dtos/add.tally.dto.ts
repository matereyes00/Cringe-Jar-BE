import { IsNotEmpty, IsString } from 'class-validator';

export class AddTallyDto {

    @IsString()
    @IsNotEmpty()
    targetName!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;
}