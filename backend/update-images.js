const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Відповідність "українська назва книги" -> "ім'я файлу в папці images"
const mapping = {
  'Майстер і Маргарита': 'Master and Margaret.jpg',
  '1984': '1984.jpg',
  'Кобзар': 'Kobzar.jpg',
  'Тигролови': 'Trygolovy.jpg',
  'Сто років самотності': '100 years.jpg',
  'Злочин і кара': 'Crime and Punishment.jpg',
  'Гаррі Поттер і філософський камінь': 'HARRY POTTER AND THE SORCERER\'S STONE.jpg',
  'Володар перснів': 'The_Fellowship_Of_The_Ring.jpg',
  'Аліса в Країні Див': 'Alise.jpg',
  'Маленький принц': 'The Little Prince.jpg',
  'Дюна': 'Dune.jpg',
  'Гра престолів': 'Game of Thrones.jpg',
  'Тринадцята казка': 'Thirteenth fairy tale.jpg',
  'Захар Беркут': 'Zakhar the golden eagle.jpg',
  'Тіні забутих предків': 'Shadow of forgotten ancestors.jpg',
  'Три мушкетери': 'Three musketeers.jpg',
  'Граф Монте-Крісто': 'The count of Monte Cristo.jpg',
  'Гордість і упередження': 'Pride and Prejudice.jpg',
  'Чорна рада': 'Black Council.jpg',
  'Лісова пісня': 'Forest song.jpg',
  'Собор': 'Cathedral.jpg'
};

async function main() {
  const books = await prisma.book.findMany();
  for (const book of books) {
    const fileName = mapping[book.title];
    if (fileName) {
      // Кодуємо назву файлу для URL (пробіли → %20)
      const encodedFileName = encodeURIComponent(fileName);
      const imageUrl = `/images/${encodedFileName}`;
      await prisma.book.update({
        where: { id: book.id },
        data: { imageUrl }
      });
      console.log(`✅ ${book.title} -> ${imageUrl}`);
    } else {
      console.log(`⚠️ Не знайдено файл для: ${book.title}`);
    }
  }
  console.log('\n🎉 Готово! Перезапустіть бекенд та оновіть сторінку.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());