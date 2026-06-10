'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CartItem {
  id: number;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: ''
  });
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      ...formData,
      total: totalPrice,
      items: cart
    };

    try {
      const res = await fetch('http://localhost:4000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        localStorage.removeItem('cart');
        alert('✅ Замовлення успішно оформлено! Дякуємо за покупку!');
        router.push('/');
      } else {
        alert('❌ Помилка при оформленні замовлення. Спробуйте ще раз.');
      }
    } catch (error) {
      alert('❌ Помилка при оформленні замовлення. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-amber-400">🛒 Кошик порожній</p>
          <Link href="/" className="inline-block mt-4 bg-amber-500 text-white px-6 py-2 rounded-full">
            Перейти до покупок
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            📝 Оформлення замовлення
          </h1>
          <Link href="/cart" className="text-amber-400 hover:text-amber-300">
            ← Повернутися до кошика
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Форма */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20">
              <h2 className="text-2xl font-bold text-amber-400 mb-6">Контактні дані</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Ім'я та прізвище *</label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Email *</label>
                  <input
                    type="email"
                    name="customerEmail"
                    required
                    value={formData.customerEmail}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Телефон *</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    required
                    value={formData.customerPhone}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Адреса доставки *</label>
                  <textarea
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition disabled:opacity-50"
                >
                  {loading ? 'Обробка...' : '✅ Підтвердити замовлення'}
                </button>
              </form>
            </div>
          </div>

          {/* Підсумок замовлення */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20 sticky top-8">
              <h2 className="text-2xl font-bold text-amber-400 mb-4">Ваше замовлення</h2>
              <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-white border-b border-slate-600 pb-2">
                    <span>{item.title} x {item.quantity}</span>
                    <span className="text-amber-400">{item.price * item.quantity} грн</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xl font-bold text-white pt-4 border-t border-amber-500">
                <span>До сплати:</span>
                <span className="text-amber-400">{totalPrice} грн</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}