import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookController } from './book/book.controller';
import { AuthController } from './auth.controller';
import { OrderController } from './order/order.controller';

@Module({
  imports: [],
  controllers: [AppController, BookController, AuthController, OrderController],
  providers: [AppService],
})
export class AppModule {}