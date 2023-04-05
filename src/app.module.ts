import { ConfigModule } from '@nestjs/config';
const envModule = ConfigModule.forRoot({
  isGlobal: true,
});
import { MiddlewareConsumer, Module } from '@nestjs/common';

import { LoggerMiddleware } from './logger.middleware';
import { TrendsModule } from './trends/trends.module';
import { CheckInOutModule } from './check-in-out/check-in-out.module';

@Module({
  imports: [envModule, TrendsModule, CheckInOutModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
