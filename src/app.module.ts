import { ConfigModule } from '@nestjs/config';
const envModule = ConfigModule.forRoot({
  isGlobal: true,
});
import { MiddlewareConsumer, Module } from '@nestjs/common';

import { LoggerMiddleware } from './logger.middleware';
import { TrendsModule } from './trends/trends.module';
import { CheckInOutModule } from './check-in-out/check-in-out.module';
import { ProblemsModule } from './problems/problems.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';
import { ProblemsService } from './problems/problems.service';
import { CheckInOutService } from './check-in-out/check-in-out.service';
import { PrismaService } from './prisma.service';
import { HealthModule } from './heath/health.module';

@Module({
  imports: [
    envModule,
    ScheduleModule.forRoot(),
    TrendsModule,
    CheckInOutModule,
    ProblemsModule,
    HealthModule,
  ],
  controllers: [],
  providers: [CronService, ProblemsService, CheckInOutService, PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
