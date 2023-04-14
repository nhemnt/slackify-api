import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma.service';
import { capitalizeFirstLetter } from 'src/lib/utils';

export const QUIZ = {
  REACT: 'react',
  NODE: 'node',
  JAVASCRIPT: 'javascript',
};

const emojis = [
  ':fire:',
  ':eyes:',
  ':white_check_mark:',
  ':raised_hands:',
  ':+1:',
  ':heart:',
  ':ghost:',
  ':raised_back_of_hand:',
];

function getRandomEmoji() {
  const funnyEmojis = [
    ':doge_dance:',
    ':aw_yeah:',
    ':doge-inception:',
    ':busy:',
    ':shipitparrot:',
    ':gigachad-typing:',
    ':3445-soyboy:',
    ':abeleaves:',
    ':amongus:',
    ':android-dance:',
    ':aussiecongaparrot:',
    ':dabparrot:',
    ':blobdance:',
  ];
  const randomIndex = Math.floor(Math.random() * funnyEmojis.length);
  return funnyEmojis[randomIndex];
}

export const createSlackBlocks = (msg: string, topic: string) => {
  const blocks: any = [
    {
      type: 'section',
      text: {
        type: 'plain_text',
        text: `${capitalizeFirstLetter(topic)} Quiz ${getRandomEmoji()}`,
        emoji: true,
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: msg,
        },
      ],
    },
  ];

  return blocks;
};

const endline = `Please use the appropriate emoji to indicate your selection of the correct answer(s). And don't be shy, we won't judge (much). :wink:`;
@Injectable()
export class ProblemsService {
  questionIndex: number;
  constructor(private prisma: PrismaService) {
    this.questionIndex = 0;
  }

  async get(topic: string) {
    const today = new Date();
    const dayOfWeek = today.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return {
        data: "Congratulations, today is a weekend day! That means you get a break from our relentless questioning. Go forth and enjoy your well-deserved rest. We'll be back on Monday to challenge your brain cells again!",
      };
    }
    const quiz = await this.prisma.quiz.findUnique({
      where: {
        name: topic,
      },
    });
    const { data: quizData, index } = quiz;
    const data = quizData[index];
    if (!data) {
      return {
        data: 'Something Went Wrong!',
      };
    }
    try {
      let markDown =
        '@channel ' + data.rawQuestion.replace(/^#### Q\d+\.\s*/, '').trim();

      markDown += '\n\n';

      markDown += data.selection
        .map((q, i) => `${emojis[i]} ${q.rawOption}`)
        .join('');

      markDown += `\n\n${endline}`;
      const { WEBHOOK_URI } = process.env;

      if (WEBHOOK_URI) {
        try {
          await axios.post(WEBHOOK_URI, {
            blocks: createSlackBlocks(markDown, topic),
          });
          await this.prisma.quiz.update({
            where: {
              name: topic,
            },
            data: {
              index: index + 1,
            },
          });
          return { message: 'ok' };
        } catch (err) {
          return { error: 'Invalid block data' };
        }
      }
    } catch (_err) {
      return {
        data: 'Something Went Wrong!',
      };
    }
  }
}
