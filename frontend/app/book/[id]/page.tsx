'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
  description?: string;
}

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/books')
      .then(res => res.json())
      .then(data => {
        const found = data.find((b: Book) => b.id === parseInt(id as string));
        setBook(found);
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    if (!book) return;
    const savedCart = localStorage.getItem('cart');
    const cart = savedCart ? JSON.parse(savedCart) : [];
    
    const existingItem = cart.find((b: any) => b.id === book.id);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ ...book, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`📚 ${book.title} додано до кошика!`);
  };

  if (loading) return <div className="text-center py-20 text-amber-400">Завантаження...</div>;
  if (!book) return <div className="text-center py-20 text-red-400">Книгу не знайдено</div>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-amber-400 hover:text-amber-300 transition">
          ← На головну
        </Link>
        
        <div className="flex flex-col md:flex-row gap-8 mt-8 bg-white rounded-2xl p-8 shadow-2xl">
          <img 
            src={book.imageUrl} 
            alt={book.title} 
            className="w-full md:w-1/3 h-96 object-cover rounded-xl shadow-lg" 
          />
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-slate-800">{book.title}</h1>
            <p className="text-2xl text-slate-500 mt-2">{book.author}</p>
            
            <div className="flex text-amber-400 text-2xl mt-4">
              ★★★★★
            </div>
            
            <p className="text-3xl font-bold text-amber-600 mt-4">{book.price} грн</p>
            
            {/* Опис книги */}
            {book.description && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-slate-700">📖 Про книгу:</h2>
                <p className="text-slate-600 mt-2 leading-relaxed">{book.description}</p>
              </div>
            )}
            
            <button
              onClick={addToCart}
              className="mt-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-xl hover:from-amber-600 hover:to-amber-700 transition text-lg font-semibold shadow-lg"
            >
              🛒 Додати в кошик
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}