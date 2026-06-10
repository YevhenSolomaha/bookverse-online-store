const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const https = require('https');
const fetch = require('node-fetch');

const prisma = new PrismaClient();

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filepath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    });
    request.on('error', reject);
  });
}

async function getCoverImage(title, author, bookId) {
  const query = encodeURIComponent(`${title} ${author}`);
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.items && data.items[0] && data.items[0].volumeInfo.imageLinks) {
      let imgUrl = data.items[0].volumeInfo.imageLinks.thumbnail;
      if (imgUrl.startsWith('http://')) imgUrl = imgUrl.replace('http://', 'https://');
      const localPath = path.join(__dirname, '../frontend/public/images', `${bookId}.jpg`);
      await downloadImage(imgUrl, localPath);
      console.log(`   🖼️ Завантажено обкладинку для ${title}`);
      return `/images/${bookId}.jpg`;
    }
  } catch (err) {
    console.log(`   ⚠️ Не вдалося знайти обкладинку для ${title}`);
  }
  // Якщо не знайшлося – ставимо заглушку (силует книги)
  return '/images/placeholder.jpg';
}

async function main() {
  console.log('🗑 Видаляємо старі книги...');
  await prisma.book.deleteMany();

  const books = [
    { title: 'Майстер і Маргарита', author: 'Михайло Булгаков', price: 250, description: 'Культовий роман про візит диявола до Москви.' },
    { title: '1984', author: 'Джордж Орвелл', price: 180, description: 'Роман-антиутопія про тотальний контроль.' },
    { title: 'Кобзар', author: 'Тарас Шевченко', price: 300, description: 'Безсмертна збірка поезій.' },
    { title: 'Тигролови', author: 'Іван Багряний', price: 220, description: 'Пригодницький роман про втечу з Сибіру.' },
    { title: 'Сто років самотності', author: 'Габріель Гарсія Маркес', price: 280, description: 'Шедевр магічного реалізму.' },
    { title: 'Злочин і кара', author: 'Федір Достоєвський', price: 260, description: 'Психологічний роман.' },
    { title: 'Гаррі Поттер і філософський камінь', author: 'Дж.К. Роулінг', price: 350, description: 'Перша книга про юного чарівника.' },
    { title: 'Володар перснів', author: 'Дж.Р.Р. Толкін', price: 450, description: 'Епічна фентезі-сага.' },
    { title: 'Аліса в Країні Див', author: 'Льюїс Керрол', price: 190, description: 'Казка про дівчинку в дивному світі.' },
    { title: 'Маленький принц', author: 'Антуан де Сент-Екзюпері', price: 170, description: 'Філософська казка-притча.' },
    { title: 'Дюна', author: 'Френк Герберт', price: 320, description: 'Науково-фантастичний роман.' },
    { title: 'Гра престолів', author: 'Джордж Мартін', price: 380, description: 'Перша книга саги "Пісня льоду й полум’я".' },
    { title: 'Тринадцята казка', author: 'Діана Сеттерфілд', price: 240, description: 'Містичний роман.' },
    { title: 'Захар Беркут', author: 'Іван Франко', price: 210, description: 'Історична повість.' },
    { title: 'Тіні забутих предків', author: 'Михайло Коцюбинський', price: 200, description: 'Повість про гуцулів.' },
    { title: 'Три мушкетери', author: 'Александр Дюма', price: 270, description: 'Пригодницький роман.' },
    { title: 'Граф Монте-Крісто', author: 'Александр Дюма', price: 350, description: 'Історія про помсту.' },
    { title: 'Гордість і упередження', author: 'Джейн Остін', price: 230, description: 'Класичний роман про кохання.' },
    { title: 'Чорна рада', author: 'Пантелеймон Куліш', price: 190, description: 'Історичний роман про козацтво.' },
    { title: 'Лісова пісня', author: 'Леся Українка', price: 160, description: 'Драма-феєрія про кохання Мавки.' },
    { title: 'Собор', author: 'Олесь Гончар', price: 210, description: 'Роман про духовність і пам’ять.' }
  ];

  // Створюємо папку для зображень, якщо її немає
  const imagesDir = path.join(__dirname, '../frontend/public/images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
    console.log('📁 Створено папку frontend/public/images');
  }

  console.log('\n📚 Додаємо книги та завантажуємо обкладинки...\n');
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    process.stdout.write(`${i+1}. ${book.title}... `);
    const imageUrl = await getCoverImage(book.title, book.author, i+1);
    await prisma.book.create({ data: { ...book, imageUrl } });
    console.log('✅');
  }

  console.log(`\n🎉 Готово! Додано ${books.length} книг з локальними обкладинками.`);
  console.log('👉 Тепер перезапустіть бекенд (npm run start:dev) та оновіть сторінку.');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());