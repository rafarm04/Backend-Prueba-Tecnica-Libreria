import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { BooksModule } from './books.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

describe('BooksController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule, BooksModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    prisma = moduleRef.get(PrismaService);
    await prisma.book.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/POST books (create)', async () => {
    const res = await request(app.getHttpServer())
      .post('/books')
      .send({
        author: 'Isaac Asimov',
        title: 'Foundation',
        price: 1999,
      })
      .expect(201);

    expect(res.body.author).toBe('Isaac Asimov');
    expect(res.body.price).toBe(1999);
  });

  it('/GET books', async () => {
    const res = await request(app.getHttpServer()).get('/books').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('/POST books (validation error)', async () => {
    await request(app.getHttpServer())
      .post('/books')
      .send({
        author: '',
        price: -1,
      })
      .expect(400);
  });
});
