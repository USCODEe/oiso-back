import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { GeminiService } from './gemini.service';
import {
  GeminiTextRequestDto,
  GeminiChatRequestDto,
  GeminiImageRequestDto,
  GeminiImageGenerationRequestDto,
} from './dto/gemini-request.dto';
import {
  GeminiResponseDto,
  GeminiErrorResponseDto,
  GeminiImageGenerationResponseDto,
  GeminiEventThumbnailResponseDto,
} from './dto/gemini-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GeminiEventDescriptionRequestDto } from './dto/gemini-event-description.dto';
import { GeminiEventThumbnailRequestDto } from './dto/gemini-event-thumbnail.dto';

@ApiTags('Gemini')
@Controller('gemini')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('text')
  @ApiOperation({ summary: '텍스트 생성' })
  @ApiBody({ type: GeminiTextRequestDto })
  @ApiResponse({
    status: 200,
    description: '텍스트 생성 성공',
    type: GeminiResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
    type: GeminiErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
    type: GeminiErrorResponseDto,
  })
  async generateText(
    @Body() requestDto: GeminiTextRequestDto,
  ): Promise<GeminiResponseDto> {
    try {
      const text = await this.geminiService.generateText(requestDto.prompt);

      return {
        text,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('event-description')
  @ApiOperation({ summary: '이벤트 설명 생성' })
  @ApiBody({ type: GeminiTextRequestDto })
  @ApiResponse({
    status: 200,
    description: '텍스트 생성 성공',
    type: GeminiResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
    type: GeminiErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
    type: GeminiErrorResponseDto,
  })
  async generateEventDescription(
    @Body() requestDto: GeminiEventDescriptionRequestDto,
  ): Promise<GeminiResponseDto> {
    try {
      const text =
        await this.geminiService.generateEventDescription(requestDto);

      return {
        text,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('event-thumbnail')
  @ApiOperation({ summary: '이벤트 썸네일 생성' })
  @ApiBody({ type: GeminiTextRequestDto })
  @ApiResponse({
    status: 200,
    description: '텍스트 생성 성공',
    type: GeminiResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
    type: GeminiErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
    type: GeminiErrorResponseDto,
  })
  async generateEventThumbnail(
    @Body() requestDto: GeminiEventThumbnailRequestDto,
  ): Promise<any> {
    return this.geminiService.generateEventThumbnail(requestDto);
  }

  @Post('chat')
  @ApiOperation({ summary: '대화형 텍스트 생성' })
  @ApiBody({ type: GeminiChatRequestDto })
  @ApiResponse({
    status: 200,
    description: '대화형 텍스트 생성 성공',
    type: GeminiResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
    type: GeminiErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
    type: GeminiErrorResponseDto,
  })
  async generateChat(
    @Body() requestDto: GeminiChatRequestDto,
  ): Promise<GeminiResponseDto> {
    try {
      const text = await this.geminiService.generateTextWithHistory(
        requestDto.prompt,
        requestDto.history || [],
      );

      return {
        text,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('image')
  @ApiOperation({ summary: '이미지 분석' })
  @ApiBody({ type: GeminiImageRequestDto })
  @ApiResponse({
    status: 200,
    description: '이미지 분석 성공',
    type: GeminiResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
    type: GeminiErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
    type: GeminiErrorResponseDto,
  })
  async analyzeImage(
    @Body() requestDto: GeminiImageRequestDto,
  ): Promise<GeminiResponseDto> {
    try {
      // Base64 데이터에서 실제 데이터 부분만 추출
      const base64Data = requestDto.imageBase64.replace(
        /^data:image\/[a-z]+;base64,/,
        '',
      );

      const description =
        await this.geminiService.generateImageDescription(base64Data);

      return {
        text: description,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('generate-image')
  @ApiOperation({ summary: '이미지 생성' })
  @ApiBody({ type: GeminiImageGenerationRequestDto })
  @ApiResponse({
    status: 200,
    description: '이미지 생성 성공',
    type: GeminiImageGenerationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
    type: GeminiErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
    type: GeminiErrorResponseDto,
  })
  async generateImage(
    @Body() requestDto: GeminiImageGenerationRequestDto,
  ): Promise<GeminiImageGenerationResponseDto> {
    try {
      const { text, imageBase64 } = await this.geminiService.generateImage(
        requestDto.prompt,
      );

      return {
        text,
        imageBase64: `data:image/png;base64,${imageBase64}`,

        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
