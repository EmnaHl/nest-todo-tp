import { StatusEnum } from '../enums/status.enum';

export class TodoModel {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    status: StatusEnum;
}