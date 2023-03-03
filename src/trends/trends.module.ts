import { Module } from '@nestjs/common';
import { TrendsController } from './trends.controller';
import { TrendsService } from './trends.service';

@Module({
  controllers: [TrendsController],
  providers: [TrendsService],
})
export class TrendsModule {}
