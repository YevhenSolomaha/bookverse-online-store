import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = 'my_secret_key_12345';

@Controller('auth')
export class AuthController {
  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    
    try {
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          role: 'user',
        },
      });
      
      return { message: 'Реєстрація успішна!', user: { id: user.id, email: user.email, role: user.role } };
    } catch (error) {
      return { error: 'Користувач з таким email вже існує' };
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    
    if (!user) {
      throw new UnauthorizedException('Неправильний email або пароль');
    }
    
    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неправильний email або пароль');
    }
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    
    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }
}