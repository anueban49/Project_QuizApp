import prisma from '../src/lib/prisma';
import examquestions from '../src/app/mockdata/examquestion.json';
import { customAlphabet } from 'nanoid';

const ARTICLE_ID = '04128130203';
const USER_ID = 'user_3Dpu4aTKoFFLORhUlGjDKxmr3Ie';

const normalizeOptions = (options: any): Array<{ label: string; text: string }> => {
  if (!options) {
    return [];
  }

  if (Array.isArray(options)) {
    return options.map((option) => {
      if (option && typeof option === 'object') {
        return {
          label: String(option.key ?? option.label ?? ''),
          text: String(option.text ?? option.value ?? ''),
        };
      }

      return {
        label: String(option ?? ''),
        text: String(option ?? ''),
      };
    });
  }

  if (typeof options === 'object') {
    return Object.entries(options).map(([label, text]) => ({
      label,
      text: String(text),
    }));
  }

  return [];
};

async function main() {
  await prisma.user.upsert({
    where: { id: USER_ID },
    create: {
      id: USER_ID,
      name: 'Seed User',
      apiKey: null,
    },
    update: {
      lastSeen: new Date(),
    },
  });

  await prisma.article.upsert({
    where: { id: ARTICLE_ID },
    create: {
      id: ARTICLE_ID,
      title: 'Seed Exam Article Section 3',
      orgArticle: 'Seeded exam article for national exam spree version 3',
      sumArticle: 'Seeded quiz data article summary.',
      userId: USER_ID,
      category: 'ETTAZ',
      subject: ['ETTAZ-proffesion'],
    },
    update: {
      title: 'Seed Exam Article',
      updatedAt: new Date(),
    },
  });
  const newId = customAlphabet("1234567890qwertyuioasdfghjklzxcvbnm", 8)
  const quizData = examquestions.map((q) => ({
    id: newId(),
    articleId: ARTICLE_ID,
    userId: USER_ID,
    question: q.question,
    correctOption: q.correctOption,
    category: q.category ?? "Unknown",
    options: normalizeOptions(q.options)
  }));

  const result = await prisma.quiz.createMany({
    data: quizData,
    skipDuplicates: true,
  });

  console.log(`✅ ${result.count} questions inserted`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

