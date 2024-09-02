import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { AppController } from './app.controller';

@Module({
  imports: [BooksModule],
  controllers: [AppController],
})
export class AppModule {}
