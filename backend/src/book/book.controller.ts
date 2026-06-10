import { Controller, Get, Post, Delete, Body, Param, Headers, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = 'my_secret_key_12345';

function verifyToken(authHeader: string) {
  if (!authHeader) throw new UnauthorizedException('Токен не надано');
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new UnauthorizedException('Невірний токен');
  }
}

@Controller('books')
export class BookController {
  @Get()
  async getAllBooks() {
    return prisma.book.findMany();
  }

  @Post()
  async createBook(@Body() bookData: any, @Headers('authorization') authHeader: string) {
    const user = verifyToken(authHeader) as any;
    if (user.role !== 'admin') {
      throw new UnauthorizedException('Доступ заборонено. Тільки для адміністратора');
    }
    return prisma.book.create({ data: bookData });
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string, @Headers('authorization') authHeader: string) {
    const user = verifyToken(authHeader) as any;
    if (user.role !== 'admin') {
      throw new UnauthorizedException('Доступ заборонено. Тільки для адміністратора');
    }
    return prisma.book.delete({ where: { id: parseInt(id) } });
  }
}