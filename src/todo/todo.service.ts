import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'; import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { UUID } from '../common/constants';
import { TodoEntity } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { StatusEnum } from './enums/status.enum';
import { TodoModel } from './models/todo.model';
import { FilterTodoDto } from './dto/filter-todo.dto';


@Injectable()
export class TodoService {
    // Version 1 : stockage en mémoire
    private todos: TodoModel[] = [];

    constructor(
        @Inject(UUID) private readonly uuid: () => string,
        @InjectRepository(TodoEntity)
        private readonly todoRepository: Repository<TodoEntity>,
    ) { }

    // ===== Version 1 : en mémoire =====
    addTodoInMemory(dto: CreateTodoDto): TodoModel {
        const todo: TodoModel = {
            id: this.uuid(),
            name: dto.name,
            description: dto.description,
            createdAt: new Date(),
            status: StatusEnum.PENDING,
        };
        this.todos.push(todo);
        return todo;
    }

    getTodosInMemory(): TodoModel[] {
        return this.todos;
    }

    // ===== Version 2 : base de données =====
    async addTodo(dto: CreateTodoDto): Promise<TodoEntity> {
        const todo = this.todoRepository.create(dto);
        return await this.todoRepository.save(todo);
    }

    async getTodos(filter: FilterTodoDto) {
        const { search, status, page = 1, limit = 10 } = filter;

        const base: FindOptionsWhere<TodoEntity> = status ? { status } : {};

        const where: FindOptionsWhere<TodoEntity> | FindOptionsWhere<TodoEntity>[] =
            search
                ? [
                    { ...base, name: Like(`%${search}%`) },
                    { ...base, description: Like(`%${search}%`) },
                ]
                : base;

        const [data, total] = await this.todoRepository.findAndCount({
            where,
            order: { createdAt: 'DESC', id: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getTodoById(id: number): Promise<TodoEntity> {
        const todo = await this.todoRepository.findOneBy({ id });

        if (!todo) {
            throw new NotFoundException(`Le todo d'id ${id} est introuvable.`);
        }

        return todo;
    }

    async updateTodo(id: number, dto: UpdateTodoDto): Promise<TodoEntity> {
        const todo = await this.todoRepository.preload({ id, ...dto });

        if (!todo) {
            throw new NotFoundException(`Le todo d'id ${id} est introuvable.`);
        }

        return await this.todoRepository.save(todo);
    }

    async softDeleteTodo(id: number): Promise<{ message: string; id: number }> {
        const todo = await this.todoRepository.findOneBy({ id }); //findOneBy ignore les todos déjà supprimés logiquement

        if (!todo) {
            throw new NotFoundException(
                `Le todo d'id ${id} est introuvable ou déjà supprimé.`,
            );
        }

        await this.todoRepository.softDelete(id);
        return { message: 'Todo supprimé (suppression logique).', id };
    }

    async restoreTodo(id: number): Promise<{ message: string; id: number }> {
        const todo = await this.todoRepository.findOne({
            where: { id },
            withDeleted: true,
        });

        if (!todo) {
            throw new NotFoundException(`Le todo d'id ${id} est introuvable.`);
        }

        if (!todo.deletedAt) {
            throw new BadRequestException(
                `Le todo d'id ${id} n'est pas supprimé, il n'y a rien à restaurer.`,
            );
        }

        await this.todoRepository.restore(id);
        return { message: 'Todo restauré avec succès.', id };
    }

    async deleteTodo(id: number): Promise<{ message: string; id: number }> {
        const result = await this.todoRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Le todo d'id ${id} est introuvable.`);
        }

        return { message: 'Todo supprimé avec succès.', id };
    }


    async countByStatus(): Promise<Record<StatusEnum, number>> {
        const rows = await this.todoRepository
            .createQueryBuilder('todo')
            .select('todo.status', 'status')
            .addSelect('COUNT(todo.id)', 'count')
            .groupBy('todo.status')
            .getRawMany();

        // On initialise tous les statuts à 0
        const result = {} as Record<StatusEnum, number>;
        for (const status of Object.values(StatusEnum)) {
            result[status] = 0;
        }

        // On remplit avec les comptages réels
        for (const row of rows) {
            result[row.status as StatusEnum] = Number(row.count);
        }

        return result;
    }

}