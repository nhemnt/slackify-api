import { Module } from '@nestjs/common';
import { CheckInOutController } from './check-in-out.controller';
import { CheckInOutService } from './check-in-out.service';

@Module({
  controllers: [CheckInOutController],
  providers: [CheckInOutService],
})
export class CheckInOutModule {}
