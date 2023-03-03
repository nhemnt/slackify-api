import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const isValid =
      req.headers.authorization === `Bearer ${process.env.API_SECRET_KEY}`;
    if (!isValid)
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Something bad happened',
      });

    next();
  }
}
