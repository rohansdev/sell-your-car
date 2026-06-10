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

@Module({
  imports: [
    UsersModule,
    ReportsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'better-sqlite3',
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          // autoLoadEntities: true,
          enableWAL: true,
          statementCacheSize: 100,
        };
      },
    }),
    /* TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: path.resolve(__dirname, '..', 'db.sqlite'), // 'db.sqlite',
      entities: [__dirname + '/** /*.entity{.ts,.js}'],
      // autoLoadEntities: true,
      synchronize: true,
      enableWAL: true,
      statementCacheSize: 100,
    }), */
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
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          secret: 's4er5w4d5f478e56',
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
