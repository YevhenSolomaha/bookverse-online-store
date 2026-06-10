import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateOrderDto {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  total: number;
  items: any[];
}

@Controller('orders')
export class OrderController {
  @Post()
  async createOrder(@Body() orderData: CreateOrderDto) {
    return prisma.order.create({
      data: {
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        address: orderData.address,
        total: orderData.total,
        items: orderData.items,
        status: 'new'
      }
    });
  }

  @Get()
  async getAllOrders() {
    return prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return prisma.order.findUnique({ where: { id: parseInt(id) } });
  }
}