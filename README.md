<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Books API with NestJS

This project is a RESTful API for managing books, built with NestJS. It demonstrates key Node.js concepts and provides a robust, well-documented API.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Running the App](#running-the-app)
4. [API Endpoints](#api-endpoints)
5. [Core Node.js Concepts Demonstrated](#core-nodejs-concepts-demonstrated)
6. [Swagger Documentation](#swagger-documentation)
7. [Testing](#testing)

## Features

- CRUD operations for books
- File streaming
- Heavy computation simulation
- Long-running operation simulation
- Error handling
- Swagger API documentation

## Installation

1. Clone the repository:
   git clone <repository-url>
   cd book-manager-nest

## 2. Install dependencies:

npm install

3. Create a `largefile.txt` in the project root (for streaming demonstration):
   node -e "require('fs').writeFileSync('largefile.txt', 'x'.repeat(1000000))"

4. Create a `heavy-computation.js` file in the project root:

```javascript
function heavyComputation() {
  let result = 0;
  for (let i = 0; i < 1000000000; i++) {
    result += i;
  }
  return result;
}

process.on('message', (msg) => {
  if (msg === 'start') {
    const result = heavyComputation();
    process.send(result);
  }
});
```

## Running the App

npm run start:dev

## API Endpoints

`GET /books`: Get all books
`GET /books/:id`: Get a specific book
`POST /books`: Create a new book
`PUT /books/:id`: Update a book
`DELETE /books/:id`: Delete a book
`GET /books/stream-large-file`: Stream a large file
`GET /books/heavy-computation`: Perform a heavy computation
`GET /books/long-operation`: Perform a long-running operation

For detailed API documentation, visit http://localhost:3000/api after starting the server.

## Core Node.js Concepts Demonstrated

1. Event Loop
   The longOperation endpoint demonstrates non-blocking I/O:

```typescript
@Get('long-operation')
async longOperation(): Promise<string> {
  console.log('Starting long operation');
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log('Long operation finished');
  return 'Long operation completed';
}
```

This operation doesn't block the event loop, allowing other requests to be processed.

2. Streams and Buffers
   File streaming is demonstrated in the streamFile endpoint:

```typescript
@Get('stream-large-file')
streamFile(@Res() res: Response) {
  const file = createReadStream(join(process.cwd(), 'largefile.txt'));
  file.pipe(res);
}
```

This uses Node.js streams to efficiently handle large files.

3. File System (fs) Module
   File operations are performed in the BooksService:

```typescript
private async readBooksFile(): Promise<string> {
  return fs.readFile(this.booksFile, 'utf-8');
}

private async writeBooksFile(books: Book[]): Promise<void> {
  await fs.writeFile(this.booksFile, JSON.stringify(books, null, 2));
}
```

4. Process and Child Processes
   The heavyComputation endpoint demonstrates the use of child processes:

```typescript
@Get('heavy-computation')
async heavyComputation(): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = fork('./heavy-computation.js');
    child.send('start');
    child.on('message', resolve);
    child.on('error', reject);
  });
}
```

This offloads CPU-intensive tasks to a separate process.

5. Error Handling

Error handling is implemented throughout the application, for example:

```typescript
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
```

## Swagger Documentation

Swagger UI is available at http://localhost:3000/api. This provides interactive API documentation and allows you to test the API directly from the browser.

![image](https://github.com/user-attachments/assets/8e2418e7-987f-4916-a104-5cf508f3b1a9)




## Testing

To run the tests:
`npm run test`

For e2e tests:
`npm run test:e2e`

To test the API manually, you can use tools like Postman or curl. Here are some example curl commands:

## Get all books

curl http://localhost:3000/books

![image](https://github.com/user-attachments/assets/1fd5f743-7ed8-406a-9854-ae989cd26243)


## Add a new book

curl -X POST -H "Content-Type: application/json" -d '{"title":"New Book","author":"Author Name"}' http://localhost:3000/books

![image](https://github.com/user-attachments/assets/3cf4f57e-fb6e-496f-bfb8-cd3c0b087855)


## Get a specific book (replace 1 with an actual book id)

curl http://localhost:3000/books/1

![image](https://github.com/user-attachments/assets/8e4d4355-89ec-45a7-9a07-d0d5d86c26bd)


## Update a book (replace 1 with an actual book id)

curl -X PUT -H "Content-Type: application/json" -d '{"title":"Updated Title"}' http://localhost:3000/books/1

## Delete a book (replace 1 with an actual book id)

curl -X DELETE http://localhost:3000/books/1

![image](https://github.com/user-attachments/assets/ce95016a-0714-44bd-9eaf-2c3aef4511b2)


## Perform long operation

curl http://localhost:3000/books/long-operation

![image](https://github.com/user-attachments/assets/71fb92af-b73d-4cfc-99bc-63a7f4b728cf)


## Perform heavy computation

curl http://localhost:3000/books/heavy-computation

![image](https://github.com/user-attachments/assets/5e24462d-aaeb-4fdc-8b03-65472cf7b1c0)


## Stream large file

curl -OJ http://localhost:3000/books/stream-large-file

![image](https://github.com/user-attachments/assets/a4a9406e-4a0c-404c-83d6-3c993a7f89eb)


Remember to replace localhost:3000 with your server's address if deploying to a different environment.

## Error Handling

This application implements comprehensive error handling:

- Custom exceptions are used for specific error cases.
- Global exception filters catch and format unhandled exceptions.
- Asynchronous operations are wrapped in try-catch blocks.

Example from `books.controller.ts`:

```typescript
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
```

## Deployment

To deploy this application:

1. Build the application:
   `npm run build`

2. Start the production server:
   `npm run start:prod`

## Future Improvements

While this project demonstrates several key Node.js concepts and provides a functional API built with Nest js, there are always opportunities for enhancement. Here are some potential improvements for future development:

1. **Database Integration**: Replace the file-based storage with a proper database system (e.g., PostgreSQL, MongoDB) for improved performance and scalability.

2. **Authentication and Authorization**: Implement user authentication and role-based access control to secure the API endpoints.

3. **Rate Limiting**: Add rate limiting to prevent API abuse and ensure fair usage.

4. **Caching**: Implement caching mechanisms (e.g., Redis) to improve response times for frequently accessed data.

5. **Pagination**: Add pagination to endpoints that return lists of books to handle large datasets more efficiently.

6. **Full-Text Search**: Implement full-text search functionality for books using a search engine like Elasticsearch.

7. **Logging**: Enhance logging capabilities for better debugging and monitoring in production environments.

8. **API Versioning**: Implement API versioning to allow for future changes without breaking existing client integrations.

9. **WebSockets**: Add real-time capabilities using WebSockets for features like live updates on book changes.

10. **Docker Integration**: Containerize the application for easier deployment and scaling.

11. **CI/CD Pipeline**: Set up a continuous integration and deployment pipeline for automated testing and deployment.

12. **GraphQL Support**: Add a GraphQL API alongside the REST API for more flexible data querying.

13. **Metrics and Monitoring**: Implement application metrics and monitoring using tools like Prometheus and Grafana.

14. **Internationalization**: Add support for multiple languages in API responses.

15. **File Upload**: Implement functionality for uploading book covers or additional documents related to books.

These improvements would enhance the functionality, performance, and maintainability of the application. Contributions addressing any of these areas are welcome!
