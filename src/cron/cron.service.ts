import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CheckInOutService } from 'src/check-in-out/check-in-out.service';
import { ProblemsService } from 'src/problems/problems.service';

@Injectable()
export class CronService {
  constructor(
    private problemsService: ProblemsService,
    private checkInOutService: CheckInOutService,
  ) {}

  @Cron('30 4 * * *')
  morningCheckInCron() {
    const now = new Date();
    console.log(`Check In cron job ran at ${now}`);
    this.checkInOutService.create({ type: 'morning' });
  }

  @Cron('30 13 * * *')
  eveningCheckOutCron() {
    const now = new Date();
    console.log(`Check Out cron job ran at ${now}`);
    this.checkInOutService.create({ type: 'evening' });
  }

  @Cron('30 7 * * *')
  questionListCron() {
    const now = new Date();
    console.log(`Question list cron job ran at ${now}`);
    this.problemsService.get();
  }

  // @Cron('*/10 * * * * *')
  // runEvery10Seconds() {
  //   const now = new Date();
  //   console.log(`cron job ran at ${now}`);
  //   console.log('Every 10 seconds');
  // }
}
