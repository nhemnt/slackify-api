import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as reactQuestions from './Questions/react.json';

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

export const createSlackBlocks = (msg: string) => {
  const blocks: any = [
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
  constructor() {
    this.questionIndex = 0;
  }

  async create() {
    return { data: reactQuestions };
  }

  async get() {
    const today = new Date();
    const dayOfWeek = today.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return {
        data: "Congratulations, today is a weekend day! That means you get a break from our relentless questioning. Go forth and enjoy your well-deserved rest. We'll be back on Monday to challenge your brain cells again!",
      };
    }
    const data = reactQuestions[this.questionIndex];
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
            blocks: createSlackBlocks(markDown),
          });
          this.questionIndex++;
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

  async updateIndex(index: number) {
    this.questionIndex = index;
    return {
      data: 'ok',
    };
  }
}
