import { Controller, Get, Query } from '@nestjs/common';
import { ProblemsService } from './problems.service';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemService: ProblemsService) {}

  @Get()
  async getProblem(@Query() query: any) {
    return await this.problemService.get(query.topic);
  }
}
