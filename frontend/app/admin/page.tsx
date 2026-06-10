'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
  description?: string;
}

export default function Admin() {
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', price: 0, imageUrl: '', description: '' });
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Перевірка авторизації адміна
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (!token || !savedUser) {
      router.push('/login');
      return;
    }
    
    const userData = JSON.parse(savedUser);
    if (userData.role !== 'admin') {
      router.push('/login');
      return;
    }
    
    setUser(userData);
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const res = await fetch('http://localhost:4000/books');
    const data = await res.json();
    setBooks(data);
  };

  const addBook = async () => {
    const token = localStorage.getItem('token');
    await fetch('http://localhost:4000/books', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ...newBook, price: Number(newBook.price) }),
    });
    setNewBook({ title: '', author: '', price: 0, imageUrl: '', description: '' });
    loadBooks();
  };

  const deleteBook = async (id: number) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:4000/books/${id}`, { 
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    loadBooks();
  };

  if (!user) {
    return <div className="text-center py-20 text-amber-400">Перевірка авторизації...</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            👑 Адмін-панель
          </h1>
          <div className="flex gap-3">
            <Link href="/admin/orders" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-blue-700 transition shadow-lg flex items-center gap-2">
              📦 Замовлення
            </Link>
            <Link href="http://localhost:3000" className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-2 rounded-full hover:from-slate-700 hover:to-slate-800 transition shadow-lg">
              ← На головну
            </Link>
          </div>
        </div>

        {/* Форма додавання книги */}
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl mb-8 border border-amber-500/20">
          <h2 className="text-2xl font-bold text-amber-400 mb-4">➕ Додати нову книгу</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Назва"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              className="p-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition"
            />
            <input
              type="text"
              placeholder="Автор"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              className="p-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition"
            />
            <input
              type="number"
              placeholder="Ціна"
              value={newBook.price}
              onChange={(e) => setNewBook({ ...newBook, price: Number(e.target.value) })}
              className="p-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition"
            />
            <input
              type="text"
              placeholder="URL зображення"
              value={newBook.imageUrl}
              onChange={(e) => setNewBook({ ...newBook, imageUrl: e.target.value })}
              className="p-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition"
            />
          </div>
          <textarea
            placeholder="Опис книги..."
            value={newBook.description}
            onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
            rows={4}
            className="mt-4 w-full p-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition"
          />
          <button onClick={addBook} className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-xl hover:from-green-600 hover:to-green-700 transition font-semibold">
            ➕ Додати книгу
          </button>
        </div>

        {/* Список книг */}
        <h2 className="text-2xl font-bold text-amber-400 mb-4">📚 Список книг</h2>
        <div className="space-y-2">
          {books.map((book) => (
            <div key={book.id} className="flex justify-between items-center bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-amber-500/20 flex-wrap gap-2">
              <div>
                <strong className="text-white">{book.title}</strong>
                <span className="text-slate-400 mx-2">-</span>
                <span className="text-amber-400">{book.author}</span>
                <span className="text-slate-400 mx-2">-</span>
                <span className="text-green-400">{book.price} грн</span>
              </div>
              <button onClick={() => deleteBook(book.id)} className="bg-red-500/80 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition">
                🗑 Видалити
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}