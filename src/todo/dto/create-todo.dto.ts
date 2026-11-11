import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { TODO_VALIDATION_MESSAGES as MSG, TODO_RULES } from '../constants/validation-messages';

export class CreateTodoDto {
    @IsNotEmpty({ message: MSG.NAME_REQUIRED })
    @IsString({ message: MSG.NAME_STRING })
    @MinLength(TODO_RULES.NAME_MIN, { message: MSG.NAME_MIN_LENGTH })
    @MaxLength(TODO_RULES.NAME_MAX, { message: MSG.NAME_MAX_LENGTH })
    name: string;

    @IsNotEmpty({ message: MSG.DESCRIPTION_REQUIRED })
    @IsString({ message: MSG.DESCRIPTION_STRING })
    @MinLength(TODO_RULES.DESCRIPTION_MIN, { message: MSG.DESCRIPTION_MIN_LENGTH })
    description: string;
}