import { ApiProperty } from '@nestjs/swagger';

export class Book {
  @ApiProperty({ example: 1, description: 'The book ID' })
  id: number;

  @ApiProperty({
    example: 'Misery',
    description: 'The title of the book',
  })
  title: string;

  @ApiProperty({
    example: 'Stephen King',
    description: 'The author of the book',
  })
  author: string;
}
