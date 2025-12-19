import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { ApiOkResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { DeleteBookDto } from './dto/delete-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOkResponse({
    description: 'List of books',
    isArray: true,
  })
  findAll() {
    return this.booksService.findAll();
  }

  @Post()
  upsert(@Body() dto: CreateBookDto) {
    return this.booksService.upsert(dto);
  }

  @Delete(':id')
  @ApiNoContentResponse({ description: 'Book deleted successfully' })
  remove(@Param() params: DeleteBookDto) {
    return this.booksService.remove(params.id);
  }
}
