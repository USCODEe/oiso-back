import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      try {
        const payload = this.jwtService.verify(token, {
          secret: this.configService.get('JWT_SECRET') || jwtConstants.secret,
        });

        // 요청 객체에 사용자 정보 추가
        req['user'] = payload;
      } catch (error) {
        // 토큰이 유효하지 않더라도 다음 미들웨어로 이동
        // 실제 인증 검사는 가드에서 수행됨
      }
    }

    next();
  }
}
