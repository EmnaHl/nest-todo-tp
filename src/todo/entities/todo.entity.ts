import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { StatusEnum } from '../enums/status.enum';
import { TimestampEntity } from '../entities/timestamp.entity';

@Entity('todo')
export class TodoEntity extends TimestampEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({
        type: 'enum',
        enum: StatusEnum,
        default: StatusEnum.PENDING,
    })
    status: StatusEnum;
}