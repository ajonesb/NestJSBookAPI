import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './book.model';
import { fork } from 'child_process';
import * as path from 'path';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async getAllBooks(): Promise<Book[]> {
    return this.booksService.getAllBooks();
  }

  @Get(':id')
  async getBook(@Param('id') id: string): Promise<Book> {
    const book = await this.booksService.getBook(Number(id));
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  @Post()
  async addBook(@Body() bookData: Omit<Book, 'id'>): Promise<Book> {
    return this.booksService.addBook(bookData);
  }

  @Put(':id')
  async updateBook(
    @Param('id') id: string,
    @Body() bookData: Partial<Book>,
  ): Promise<Book> {
    const updatedBook = await this.booksService.updateBook(
      Number(id),
      bookData,
    );
    if (!updatedBook) {
      throw new NotFoundException('Book not found');
    }
    return updatedBook;
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string): Promise<void> {
    const deleted = await this.booksService.deleteBook(Number(id));
    if (!deleted) {
      throw new NotFoundException('Book not found');
    }
  }

  @Get('heavy-computation')
  async performHeavyComputation(
    @Query('duration') durationQuery: string,
  ): Promise<string> {
    const duration = parseInt(durationQuery) || 5000;
    return new Promise((resolve, reject) => {
      const child = fork(path.join(__dirname, 'heavy-computation.worker.js'));
      child.send(duration);
      child.on('message', resolve);
      child.on('error', reject);
    });
  }
}
