import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoService } from './todo.service';
import { FilterTodoDto } from './dto/filter-todo.dto';

@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    // Version 2 : base de données
    @Post()
    addTodo(@Body() dto: CreateTodoDto) {
        return this.todoService.addTodo(dto);
    }

    @Get()
    getTodos(@Query() filter: FilterTodoDto) {
        return this.todoService.getTodos(filter);
    }

    @Get('memory')
    getTodosInMemory() {
        return this.todoService.getTodosInMemory();
    }

    // count (ex 13)
    @Get('stats')
    countByStatus() {
        return this.todoService.countByStatus();
    }

    @Get('all') //Cette route renvoie aussi les todos supprimés, avec leur deletedAt rempli
    getAllTodosWithDeleted() {
        return this.todoService.getAllTodosWithDeleted();
    }

    @Get(':id')
    getTodoById(@Param('id', ParseIntPipe) id: number) {
        return this.todoService.getTodoById(id);
    }


    @Patch(':id')
    updateTodo(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTodoDto,
    ) {
        return this.todoService.updateTodo(id, dto);
    }

    // Suppression définitive
    @Delete(':id')
    deleteTodo(@Param('id', ParseIntPipe) id: number) {
        return this.todoService.deleteTodo(id);
    }

    // Suppression logique (deletedAt)
    @Delete('soft/:id')
    softDeleteTodo(@Param('id', ParseIntPipe) id: number) {
        return this.todoService.softDeleteTodo(id);
    }

    // Restauration
    @Patch('restore/:id')
    restoreTodo(@Param('id', ParseIntPipe) id: number) {
        return this.todoService.restoreTodo(id);
    }



    // Version 1 : en mémoire
    @Post('memory')
    addTodoInMemory(@Body() dto: CreateTodoDto) {
        return this.todoService.addTodoInMemory(dto);
    }


}