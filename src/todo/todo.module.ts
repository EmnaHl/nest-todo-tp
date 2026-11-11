import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './entities/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
    imports: [TypeOrmModule.forFeature([TodoEntity])],
    exports: [TypeOrmModule],
    controllers: [TodoController],
    providers: [TodoService],
})
export class TodoModule { }
