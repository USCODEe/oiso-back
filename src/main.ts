import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as os from 'os';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 쿠키 파서 미들웨어 추가
  app.use(cookieParser());

  // CORS 설정
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 전역 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성은 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있으면 요청 자체를 막음
      transform: true, // 요청 데이터를 DTO 클래스의 인스턴스로 자동 변환
    }),
  );

  // 전역 예외 필터 설정
  app.useGlobalFilters(new HttpExceptionFilter());

  // 전역 인터셉터 설정
  app.useGlobalInterceptors(new TransformInterceptor());

  app.getHttpAdapter().get('/', (req, res) => {
    res.status(200).send('OK');
  });

  // API 접두사 설정
  app.setGlobalPrefix('api');

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('오이소 API')
    .setDescription('오이소 애플리케이션의 API 문서')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'accessToken',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 8080;

  // 모든 네트워크 인터페이스에서 접근 가능하도록 0.0.0.0으로 바인딩
  await app.listen(port, '0.0.0.0');

  // 로컬 IP 주소들 가져오기
  const networkInterfaces = os.networkInterfaces();
  const localIPs = [];

  Object.keys(networkInterfaces).forEach((interfaceName) => {
    const interfaces = networkInterfaces[interfaceName];
    interfaces?.forEach((networkInterface) => {
      if (networkInterface.family === 'IPv4' && !networkInterface.internal) {
        localIPs.push(networkInterface.address);
      }
    });
  });

  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
  console.log(`로컬 접속: http://localhost:${port}/api`);
  console.log(`네트워크 접속:`);
  localIPs.forEach((ip) => {
    console.log(`  http://${ip}:${port}/api`);
  });
  console.log(`API 문서: http://localhost:${port}/api/docs`);
}
bootstrap();
