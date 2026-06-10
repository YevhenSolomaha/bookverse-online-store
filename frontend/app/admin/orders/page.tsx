'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  total: number;
  items: any[];
  status: string;
  createdAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:4000/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Помилка:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-amber-400">Завантаження...</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            📦 Замовлення
          </h1>
          <Link href="/admin" className="text-amber-400 hover:text-amber-300">
            ← Назад в адмін-панель
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-center text-slate-400">Замовлень поки немає.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <p className="text-amber-400 font-bold">Замовлення #{order.id}</p>
                    <p className="text-white">{order.customerName}</p>
                    <p className="text-slate-400 text-sm">{order.customerEmail}</p>
                    <p className="text-slate-400 text-sm">{order.customerPhone}</p>
                    <p className="text-slate-400 text-sm mt-2">{order.address}</p>
                    <p className="text-white mt-2">Сума: <span className="text-amber-400">{order.total} грн</span></p>
                    <p className="text-slate-400 text-sm">Дата: {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="bg-green-500/20 px-3 py-1 rounded-full">
                    <span className="text-green-400 text-sm">{order.status}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-600">
                  <p className="text-amber-400 text-sm mb-2">Товари:</p>
                  <div className="space-y-1">
                    {order.items.map((item: any, idx: number) => (
                      <p key={idx} className="text-white text-sm">
                        {item.title} x {item.quantity} — {item.price * item.quantity} грн
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}