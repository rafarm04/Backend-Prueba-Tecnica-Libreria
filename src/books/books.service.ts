import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.book.findMany();
  }

  async upsert(data: { author: string; title: string; price: number }) {
    return this.prisma.book.upsert({
      where: {
        author_title: {
          author: data.author,
          title: data.title,
        },
      },
      update: {
        price: data.price,
      },
      create: {
        author: data.author,
        title: data.title,
        price: data.price,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.book.delete({ where: { id } });
  }
}
