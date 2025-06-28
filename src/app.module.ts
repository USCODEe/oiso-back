import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

import { UserModule } from './user/user.module';
import { GeminiModule } from './gemini/gemini.module';
import {
  User,
  Space,
  Project,
  Reservation,
  Review,
  Funding,
  FundingOption,
  SpaceType,
} from './entities';
import { Category } from './entities/category.entity';
import { ProjectModule } from './project/project.module';
import { SeedModule } from './common/services/seed.module';
import { CategoryModule } from './category/category.module';
import { StorageModule } from './storage/storage.module';
import { SpaceModule } from './space/space.module';
import { FundingModule } from './funding/funding.module';
import { PaymentModule } from './payment/payment.module';
import { Payment } from './entities/payment-history.entity';

@Module({
  imports: [
    // 환경변수 설정
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    // 데이터베이스 연결 설정
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_NAME', 'oiso'),
        entities: [
          User,
          Space,
          Project,
          Reservation,
          Review,
          Funding,
          Category,
          FundingOption,
          SpaceType,
          Payment,
        ],
        synchronize: configService.get('DB_SYNC', 'false') === 'true',
        logging: configService.get('DB_LOGGING', 'false') === 'true',
      }),
    }),

    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     uri: configService.get(
    //       'MONGO_HOST',
    //       'mongodb://localhost:27017/local-db',
    //     ),
    //   }),
    // }),

    // 시드 데이터 모듈
    SeedModule,

    // 인증 모듈
    AuthModule,

    UserModule,

    // Gemini 모듈
    GeminiModule,

    ProjectModule,

    CategoryModule,

    // Storage 모듈
    StorageModule,

    SpaceModule,

    FundingModule,

    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
