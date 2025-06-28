import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { jwtConstants } from '../../common/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // 쿠키에서 토큰 추출
        (request) => {
          if (request?.cookies) {
            return request.cookies['access_token'];
          }
          return null;
        },
        // Bearer 토큰도 여전히 지원 (선택사항)
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    // 여기서 페이로드를 검증하거나 추가 정보를 포함할 수 있습니다.
    // 예: 사용자 정보 조회 등
    if (!payload) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
