import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProblemsService } from './problems.service';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemService: ProblemsService) {}

  @Post()
  async createProblem(@Body() body: any) {
    return await this.problemService.updateIndex(body.index);
  }

  @Get()
  async getProblem() {
    return await this.problemService.get();
  }
}
