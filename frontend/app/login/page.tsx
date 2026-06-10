'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? 'login' : 'register';
    const res = await fetch(`http://localhost:4000/auth/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert(`Вітаємо, ${data.user.email}!`);
        router.push('/');
      } else {
        alert('Реєстрація успішна! Тепер увійдіть.');
        setIsLogin(true);
      }
    } else {
      setError(data.error || data.message || 'Помилка');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl w-full max-w-md border border-amber-500/20">
        <h1 className="text-3xl font-bold text-amber-400 text-center mb-6">
          {isLogin ? '🔐 Вхід' : '📝 Реєстрація'}
        </h1>
        
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition"
          >
            {isLogin ? 'Увійти' : 'Зареєструватися'}
          </button>
        </form>
        
        <p className="text-center text-slate-400 mt-4">
          {isLogin ? "Немає акаунта?" : "Вже є акаунт?"}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-amber-400 hover:underline">
            {isLogin ? 'Зареєструватися' : 'Увійти'}
          </button>
        </p>
        
        <div className="text-center mt-4">
          <Link href="/" className="text-slate-500 hover:text-slate-400 text-sm">
            ← На головну
          </Link>
        </div>
      </div>
    </main>
  );
}