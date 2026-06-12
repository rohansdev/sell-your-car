import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
// import path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import session from 'express-session';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { LoggerMiddleware } from './middlewares/logger/logger.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { UsersController } from './users/users.controller';
// import { ReportsController } from './reports/reports.controller';
// import * as ormconfig from '../ormconfig.js';
const ormconfig = require('../ormconfig.js');

@Module({
  imports: [
    UsersModule,
    ReportsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot(ormconfig),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          secret: this.configService.get('COOKIE_KEY') as string,
          resave: false,
          saveUninitialized: false,
          cookie: {
            maxAge: 3600000,
            httpOnly: true,
            secure: false,
          },
        }),
        LoggerMiddleware,
      )
      .forRoutes('*'); // OR particular controllers e.g. UsersController, ReportsController
  }
}
