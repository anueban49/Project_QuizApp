import prisma from '../src/lib/prisma';
import examquestions from '../src/app/mockdata/examquestion.json';

const ARTICLE_ID = '8808422988';
const USER_ID = 'user_3Dpu4aTKoFFLORhUlGjDKxmr3Ie';

const normalizeOptions = (options: Record<string, string> | any): Array<{ label: string; text: string }> => {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    return [];
  }

  return Object.entries(options).map(([label, text]) => ({
    label,
    text: String(text),
  }));
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
      title: 'Seed Exam Article',
      orgArticle: 'Seeded exam article for quiz data.',
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

  const quizData = examquestions.versions.A.map((q) => ({
    id: q.id,
    articleId: ARTICLE_ID,
    userId: USER_ID,
    question: q.question,
    correctOption: q.answer,
    category: q.category ?? "Unknown",
    options: normalizeOptions(q.options),
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

