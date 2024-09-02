import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  Res,
  InternalServerErrorException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './book.model';
import { createReadStream } from 'fs';
import { join } from 'path';
import { fork } from 'child_process';
import { Response } from 'express';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('stream-large-file')
  streamFile(@Res() res: Response) {
    console.log('Streaming file...');
    const file = createReadStream(join(process.cwd(), 'largefile.txt'));
    res.set({
      'Content-Type': 'text/plain',
      'Content-Disposition': 'attachment; filename="largefile.txt"',
    });
    file.pipe(res);
  }

  @Get('heavy-computation')
  async heavyComputation(): Promise<number> {
    return new Promise((resolve, reject) => {
      const child = fork('./heavy-computation.js');
      child.send('start');
      child.on('message', resolve);
      child.on('error', reject);
    });
  }

  @Get('long-operation')
  async longOperation(): Promise<string> {
    console.log('Starting long operation');
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log('Long operation finished');
    return 'Long operation completed';
  }

  @Get()
  async getAllBooks(): Promise<Book[]> {
    return this.booksService.getAllBooks();
  }

  @Get(':id')
  async getBook(@Param('id') id: string) {
    try {
      return await this.booksService.getBook(Number(id));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @Post()
  async addBook(@Body() bookData: Omit<Book, 'id'>): Promise<Book> {
    const newBook = await this.booksService.addBook(bookData);
    await this.booksService.logOperation(`Added book: ${newBook.title}`);
    return newBook;
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
}
