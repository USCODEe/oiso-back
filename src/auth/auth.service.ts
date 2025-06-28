import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { jwtConstants } from '../common/constants';
import { UserService } from 'src/user/user.service';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async login(authCredentialsDto: AuthCredentialsDto): Promise<{
    tokens: { accessToken: string; refreshToken: string; expiresIn: string };
    user: User;
  }> {
    const { email, password } = authCredentialsDto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 이메일입니다.');
    }

    const isPasswordValid = await this.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      roles: user.role,
    });

    return { tokens, user };
  }

  async googleLogin(reqUser: any) {
    if (!reqUser) {
      throw new UnauthorizedException('Google 로그인에 실패했습니다.');
    }

    console.log('[Google 로그인 요청] : ', reqUser);

    let user = await this.userService.findByEmail(reqUser.email);

    if (!user) {
      // 새로운 사용자 생성
      const createUserDto = {
        email: reqUser.email,
        name: reqUser.name,
        provider: reqUser.provider,
        providerId: reqUser.providerId,
      };
      user = await this.userService.createUser(createUserDto);
    }

    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      roles: user.role,
    });

    return { tokens, user };
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async generateTokens(
    payload: any,
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: string }> {
    const accessToken = this.jwtService.sign(payload);

    // 리프레시 토큰 생성
    const refreshToken = this.jwtService.sign(
      { sub: payload.sub },
      {
        secret:
          this.configService.get('JWT_REFRESH_SECRET') ||
          jwtConstants.refreshSecret,
        expiresIn:
          this.configService.get('JWT_REFRESH_EXPIRES_IN') ||
          jwtConstants.refreshExpiresIn,
      },
    );

    return {
      accessToken,
      refreshToken,
      expiresIn:
        this.configService.get('JWT_EXPIRES_IN') || jwtConstants.expiresIn,
    };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; expiresIn: string }> {
    try {
      // 리프레시 토큰 검증
      const payload = this.jwtService.verify(refreshToken, {
        secret:
          this.configService.get('JWT_REFRESH_SECRET') ||
          jwtConstants.refreshSecret,
      });

      // 새로운 액세스 토큰 생성
      const newPayload = { sub: payload.sub };
      const accessToken = this.jwtService.sign(newPayload);

      return {
        accessToken,
        expiresIn:
          this.configService.get('JWT_EXPIRES_IN') || jwtConstants.expiresIn,
      };
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }
  }
}
