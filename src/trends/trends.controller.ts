import { Controller, Post, Body } from '@nestjs/common';
import { TrendsService } from './trends.service';

@Controller('trends')
export class TrendsController {
  constructor(private readonly trendsService: TrendsService) {}

  @Post()
  async createTrend(@Body() createTrendsDto: any) {
    return await this.trendsService.create(createTrendsDto);
  }
}
