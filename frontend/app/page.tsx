'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
  description?: string;
}

export default function Home() {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('default');
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;

  useEffect(() => {
    fetch('http://localhost:4000/books')
      .then(res => res.json())
      .then(data => {
        const booksArray = Array.isArray(data) ? data : [];
        setAllBooks(booksArray);
        setBooks(booksArray);
        setLoading(false);
      })
      .catch(error => {
        console.error('Помилка:', error);
        setAllBooks([]);
        setBooks([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('cart');
      const cart = savedCart ? JSON.parse(savedCart) : [];
      setCartCount(cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0));
    };
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  useEffect(() => {
    let filtered = [...allBooks];
    if (search) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
      );
    }
    filtered = filtered.filter(book =>
      book.price >= priceRange.min && book.price <= priceRange.max
    );
    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name_asc') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    setBooks(filtered);
    setCurrentPage(1);
  }, [search, priceRange, sortBy, allBooks]);

  const addToCart = (book: Book) => {
    const savedCart = localStorage.getItem('cart');
    const cart = savedCart ? JSON.parse(savedCart) : [];
    const existingItem = cart.find((b: any) => b.id === book.id);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ ...book, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    const newCount = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
    setCartCount(newCount);
    alert(`📚 ${book.title} додано до кошика!`);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    alert('Ви вийшли з системи');
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = Array.isArray(books) ? books.slice(indexOfFirstBook, indexOfLastBook) : [];
  const totalPages = Array.isArray(books) ? Math.ceil(books.length / booksPerPage) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-2xl text-amber-400">📖 Завантаження книг...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Шапка */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            📚 Книжковий магазин
          </h1>
          <div className="flex gap-3 items-center flex-wrap">
            <Link href="/cart" className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2 rounded-full hover:from-amber-600 hover:to-amber-700 transition shadow-lg flex items-center gap-2">
              🛒 Кошик ({cartCount})
            </Link>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link href="/admin" className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-purple-700 transition shadow-lg flex items-center gap-2">
                    👑 Адмін
                  </Link>
                )}
                <div className="flex gap-2 items-center bg-slate-800 rounded-full px-4 py-2">
                  <span className="text-amber-400">👤 {user.email}</span>
                  <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition">
                    Вийти
                  </button>
                </div>
              </>
            ) : (
              <Link href="/login" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-blue-700 transition shadow-lg flex items-center gap-2">
                🔑 Вхід / Реєстрація
              </Link>
            )}
          </div>
        </div>

        {/* Пошук, фільтрація, сортування */}
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl mb-8 border border-amber-500/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="🔍 Пошук..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition"
            />
            <div>
              <label className="block text-sm mb-1 text-amber-400">Ціна від:</label>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                className="p-3 bg-slate-800 border border-slate-600 rounded-xl text-white w-full"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-amber-400">Ціна до:</label>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                className="p-3 bg-slate-800 border border-slate-600 rounded-xl text-white w-full"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-amber-400">Сортувати:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-3 bg-slate-800 border border-slate-600 rounded-xl text-white w-full"
              >
                <option value="default">За замовчуванням</option>
                <option value="price_asc">Ціна: від дешевих</option>
                <option value="price_desc">Ціна: від дорогих</option>
                <option value="name_asc">Назва: А-Я</option>
              </select>
            </div>
          </div>
          <div className="mt-3 text-amber-400 text-sm">📖 Знайдено книг: {books.length}</div>
        </div>

        {/* Список книг */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentBooks.map((book) => (
            <Link href={`/book/${book.id}`} key={book.id}>
              <div className="bg-white rounded-xl shadow-xl overflow-hidden hover:scale-105 transition duration-300 hover:shadow-2xl cursor-pointer flex flex-col h-full">
                <div className="bg-slate-100 flex items-center justify-center p-2">
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full h-48 object-contain"
                    style={{ maxHeight: '192px' }}
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-slate-800 line-clamp-2 min-h-[56px]">{book.title}</h2>
                  <p className="text-slate-500 text-sm mt-1">{book.author}</p>
                  <p className="text-lg font-bold text-amber-600 mt-2">{book.price} грн</p>
                  {book.description && (
                    <p className="text-slate-600 text-sm mt-2 line-clamp-3">
                      {book.description.length > 100 ? book.description.substring(0, 100) + '...' : book.description}
                    </p>
                  )}
                  <div className="flex text-amber-400 text-sm mt-2">★★★★☆</div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(book);
                    }}
                    className="mt-3 w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 rounded-xl hover:from-amber-600 hover:to-amber-700 transition font-semibold"
                  >
                    🛒 Додати в кошик
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Пагінація */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 hover:bg-slate-600">← Назад</button>
            <span className="px-4 py-2 bg-amber-500 text-white rounded-lg">{currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 hover:bg-slate-600">Вперед →</button>
          </div>
        )}
      </div>
      <style jsx global>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </main>
  );
}