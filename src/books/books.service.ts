import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from './book.model';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class BooksService {
  private booksFile = path.join(__dirname, '..', '..', 'data', 'books.json');

  async addBook(bookData: Omit<Book, 'id'>): Promise<Book> {
    const books = await this.getAllBooks();
    const newBook = { id: Date.now(), ...bookData };
    books.push(newBook);
    await this.writeBooksFile(books);
    return newBook;
  }

  async getAllBooks(): Promise<Book[]> {
    try {
      await fs.access(this.booksFile);
      const data = await fs.readFile(this.booksFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('books.json not found, creating it...');
        await this.writeBooksFile([]);
        return [];
      }
      throw error;
    }
  }
  async getBook(id: number): Promise<Book> {
    const books = await this.getAllBooks();
    const book = books.find((b) => b.id === id);
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return book;
  }

  async updateBook(id: number, bookData: Partial<Book>): Promise<Book> {
    const books = await this.getAllBooks();
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
      books[index] = { ...books[index], ...bookData };
      await this.writeBooksFile(books);
      return books[index];
    }
    return null;
  }

  async deleteBook(id: number): Promise<boolean> {
    const books = await this.getAllBooks();
    const initialLength = books.length;
    const updatedBooks = books.filter((book) => book.id !== id);
    await this.writeBooksFile(updatedBooks);
    return updatedBooks.length < initialLength;
  }

  // private async readBooksFile(): Promise<string> {
  //   try {
  //     return await fs.readFile(this.booksFile, 'utf-8');
  //   } catch (error) {
  //     if (error.code === 'ENOENT') {
  //       await this.writeBooksFile([]);
  //       return '[]';
  //     }
  //     throw error;
  //   }
  // }

  private async writeBooksFile(books: Book[]): Promise<void> {
    const dir = path.dirname(this.booksFile);
    try {
      await fs.access(dir);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`Directory ${dir} not found, creating it...`);
        await fs.mkdir(dir, { recursive: true });
      } else {
        throw error;
      }
    }
    await fs.writeFile(this.booksFile, JSON.stringify(books, null, 2));
  }

  async logOperation(operation: string): Promise<void> {
    const logFile = path.join(__dirname, '..', '..', 'data', 'operations.log');
    await fs.appendFile(logFile, `${new Date().toISOString()}: ${operation}\n`);
  }
}
