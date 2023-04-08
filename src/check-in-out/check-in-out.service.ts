import { Injectable } from '@nestjs/common';
import axios from 'axios';

export const createSlackBlocks = (msg: string) => {
  const blocks: any = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${msg} `,
      },
    },
  ];

  return blocks;
};
@Injectable()
export class CheckInOutService {
  async create(createCheckInOutDto) {
    return new Promise(async (resolve) => {
      try {
        const today = new Date();
        const dayOfWeek = today.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          return {
            data: 'Weekend!',
          };
        }

        const morningPunchInMessage =
          "@channel Rise and shine, sleepyhead! It's time to check in and start your day. :doge_dance:";

        const eveningPunchOutMessage =
          "@channel Congratulations on another productive day! Don't forget to punch out and enjoy your evening. :dabparrot:";

        const message =
          createCheckInOutDto.type === 'morning'
            ? morningPunchInMessage
            : eveningPunchOutMessage;
        const { WEBHOOK_URI_PUNCH_IN_OUT } = process.env;
        if (WEBHOOK_URI_PUNCH_IN_OUT) {
          try {
            await axios.post(WEBHOOK_URI_PUNCH_IN_OUT, {
              blocks: createSlackBlocks(message),
            });
            resolve({ message: 'ok' });
          } catch (err) {
            resolve({ error: 'Invalid block data' });
          }
        }
      } catch (error) {
        let message = '';
        if (error.response) {
          message = error.response.data;
        } else {
          message = error.message;
        }
        resolve({ message });
      }
    });
  }
}
