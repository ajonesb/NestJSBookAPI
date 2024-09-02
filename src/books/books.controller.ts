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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiProduces,
} from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('stream-large-file')
  @ApiOperation({ summary: 'Stream a large file' })
  @ApiResponse({ status: 200, description: 'File streamed successfully.' })
  @ApiProduces('text/plain')
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
  @ApiOperation({ summary: 'Perform a heavy computation' })
  @ApiResponse({ status: 200, description: 'Computation result', type: Number })
  async heavyComputation(): Promise<number> {
    return new Promise((resolve, reject) => {
      const child = fork('./heavy-computation.js');
      child.send('start');
      child.on('message', resolve);
      child.on('error', reject);
    });
  }

  @Get('long-operation')
  @ApiOperation({ summary: 'Perform a long-running operation' })
  @ApiResponse({
    status: 200,
    description: 'Operation completed',
    type: String,
  })
  async longOperation(): Promise<string> {
    console.log('Starting long operation');
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log('Long operation finished');
    return 'Long operation completed';
  }

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({ status: 200, description: 'Return all books.', type: [Book] })
  async getAllBooks(): Promise<Book[]> {
    return this.booksService.getAllBooks();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by id' })
  @ApiParam({ name: 'id', type: 'number', description: 'Book ID' })
  @ApiResponse({ status: 200, description: 'Return a book.', type: Book })
  @ApiResponse({ status: 404, description: 'Book not found.' })
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
  @ApiOperation({ summary: 'Create a new book' })
  @ApiBody({ type: Book })
  @ApiResponse({
    status: 201,
    description: 'The book has been successfully created.',
    type: Book,
  })
  async addBook(@Body() bookData: Omit<Book, 'id'>): Promise<Book> {
    const newBook = await this.booksService.addBook(bookData);
    await this.booksService.logOperation(`Added book: ${newBook.title}`);
    return newBook;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a book' })
  @ApiParam({ name: 'id', type: 'number', description: 'Book ID' })
  @ApiBody({ type: Book })
  @ApiResponse({
    status: 200,
    description: 'The book has been successfully updated.',
    type: Book,
  })
  @ApiResponse({ status: 404, description: 'Book not found.' })
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
  @ApiOperation({ summary: 'Delete a book' })
  @ApiParam({ name: 'id', type: 'number', description: 'Book ID' })
  @ApiResponse({
    status: 200,
    description: 'The book has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  async deleteBook(@Param('id') id: string): Promise<void> {
    const deleted = await this.booksService.deleteBook(Number(id));
    if (!deleted) {
      throw new NotFoundException('Book not found');
    }
  }
}
