import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';
import { StatusEnum } from '../enums/status.enum';
import { TODO_VALIDATION_MESSAGES as MSG } from '../constants/validation-messages';

export class FilterTodoDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(StatusEnum, { message: MSG.STATUS_INVALID })
    status?: StatusEnum;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: MSG.PAGE_INVALID })
    @Min(1, { message: MSG.PAGE_INVALID })
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: MSG.LIMIT_INVALID })
    @Min(1, { message: MSG.LIMIT_INVALID })
    @Max(50, { message: MSG.LIMIT_INVALID })
    limit?: number = 10;
}