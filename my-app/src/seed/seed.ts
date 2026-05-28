import { customAlphabet, nanoid } from 'nanoid';
import prisma from '../lib/prisma';
import examquestions from '@/app/mockdata/examquestion.json';

const ARTICLE_ID = '2026052604';
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
            id: '2026052604',
            title: 'Fundamentals for fresh graduatee quiz',
            orgArticle: 'Fundamentals for junior dev - networking basic',
            sumArticle: 'Consists of hardcoded json data of quizzes. No re-generating quiz needed',
            userId: USER_ID,
            category: 'ETTAZ',
            subject: ['ETTAZ-proffesion'],
        },
        update: {
            title: 'Seed Exam Article',
            updatedAt: new Date(),
        },
    });
    const newId = customAlphabet("ABCD1234567890", 6)
    const quizData = examquestions.map((q) => ({
        id: newId(),
        articleId: ARTICLE_ID,
        userId: USER_ID,
        question: q.question as string,
        correctOption: q.correctOption as string,
        options: q.options,
        subject: q.subject,
        category: q.category,
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

