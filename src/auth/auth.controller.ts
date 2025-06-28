import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request, Response } from 'express';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 로그인 엔드포인트
  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: AuthCredentialsDto })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '로그인 실패',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
  })
  @ApiTags('Auth')
  @Post('login')
  async login(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const { tokens, user } = await this.authService.login(authCredentialsDto);

    // 쿠키에 토큰 설정
    response.cookie('access_token', tokens.accessToken, {
      httpOnly: true, // XSS 공격 방지
      secure: process.env.NODE_ENV === 'production', // HTTPS에서만 전송
      sameSite: 'strict', // CSRF 공격 방지
      maxAge: 15 * 60 * 1000, // 15분 (액세스 토큰 만료 시간)
    });

    response.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일 (리프레시 토큰 만료 시간)
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      user: {
        id: user.id,
        email: user.email,
        roles: [user.role],
      },
    };
  }

  // 토큰 갱신 엔드포인트
  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('리프레시 토큰이 없습니다.');
    }

    const result = await this.authService.refreshToken(refreshToken);

    // 새로운 액세스 토큰을 쿠키에 설정
    response.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15분
    });

    return result;
  }

  // 로그아웃 엔드포인트
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    // 쿠키에서 토큰 제거
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');

    return { message: '로그아웃되었습니다.' };
  }

  // 현재 인증된 사용자 정보 조회
  @UseGuards(JwtAuthGuard)
  @Get('check-user')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // 구글 로그인 페이지로 리디렉션됩니다.
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { tokens, user } = await this.authService.googleLogin(req.user);

    response.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    response.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // TODO: 프론트엔드 리디렉션 URL 설정
    response.redirect('https://oiso.shop/login/success');
  }
}
