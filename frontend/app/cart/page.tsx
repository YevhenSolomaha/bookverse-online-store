'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CartItem {
  id: number;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (bookId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const newCart = cart.map(item =>
      item.id === bookId ? { ...item, quantity: newQuantity } : item
    );
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = (bookId: number) => {
    const newCart = cart.filter(item => item.id !== bookId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            🛒 Кошик ({totalItems} тов.)
          </h1>
          <Link href="http://localhost:3000" className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-2 rounded-full hover:from-slate-700 hover:to-slate-800 transition shadow-lg">
            ← На головну
          </Link>
        </div>
        
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-amber-400">🛒 Кошик порожній</p>
            <p className="text-slate-400 mt-2">Додайте книги з головної сторінки</p>
            <Link href="http://localhost:3000" className="inline-block mt-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2 rounded-full hover:from-amber-600 hover:to-amber-700 transition">
              Перейти до книг
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-4">
                    <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800">{item.title}</h2>
                      <p className="text-slate-500">{item.author}</p>
                      <p className="text-amber-600 font-bold">{item.price} грн</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-slate-200 text-slate-800 w-8 h-8 rounded-full hover:bg-slate-300"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-slate-200 text-slate-800 w-8 h-8 rounded-full hover:bg-slate-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition ml-4"
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-right bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <p className="text-2xl font-bold text-amber-400">Загальна сума: {totalPrice} грн</p>
             <Link href="/checkout">
             <button className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition text-lg font-semibold">
             ✅ Оформити замовлення
             </button>
             </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}