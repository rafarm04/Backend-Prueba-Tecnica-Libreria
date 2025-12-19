import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BooksService', () => {
  let service: BooksService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BooksService, PrismaService],
    }).compile();

    service = module.get<BooksService>(BooksService);
    prisma = module.get<PrismaService>(PrismaService);

    // Limpia la BD antes de cada test
    await prisma.book.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new book (upsert)', async () => {
    const book = await service.upsert({
      author: 'George Orwell',
      title: '1984',
      price: 1299,
    });

    expect(book).toBeDefined();
    expect(book.author).toBe('George Orwell');
    expect(book.price).toBe(1299);
  });

  it('should update book price if author + title already exist', async () => {
    await service.upsert({
      author: 'George Orwell',
      title: '1984',
      price: 1299,
    });

    const updated = await service.upsert({
      author: 'George Orwell',
      title: '1984',
      price: 1599,
    });

    expect(updated.price).toBe(1599);

    const books = await service.findAll();
    expect(books.length).toBe(1);
  });

  it('should return all books', async () => {
    await service.upsert({
      author: 'Author 1',
      title: 'Book 1',
      price: 1000,
    });

    const books = await service.findAll();
    expect(books.length).toBe(1);
  });

  it('should delete a book', async () => {
    const book = await service.upsert({
      author: 'Author 2',
      title: 'Book 2',
      price: 2000,
    });

    await service.remove(book.id);

    const books = await service.findAll();
    expect(books.length).toBe(0);
  });
});
