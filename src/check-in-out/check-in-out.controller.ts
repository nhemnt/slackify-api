import { Controller, Post, Body } from '@nestjs/common';
import { CheckInOutService } from './check-in-out.service';

@Controller('check-in-out')
export class CheckInOutController {
  constructor(private readonly checkInOutService: CheckInOutService) {}

  @Post()
  async createCheckInOut(@Body() createCheckInOutDto: any) {
    return await this.checkInOutService.create(createCheckInOutDto);
  }
}
