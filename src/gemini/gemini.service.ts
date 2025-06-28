import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { GeminiEventDescriptionRequestDto } from './dto/gemini-event-description.dto';
import { GeminiEventThumbnailRequestDto } from './dto/gemini-event-thumbnail.dto';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenAI;

  constructor(private storageService: StorageService) {
    this.genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  private sanitizePrompt(prompt: string): string {
    // 제어 문자들을 제거하거나 공백으로 대체
    return prompt
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // 제어 문자 제거
      .replace(/\r\n/g, '\n') // Windows 줄바꿈을 Unix 줄바꿈으로 통일
      .replace(/\r/g, '\n') // 캐리지 리턴을 줄바꿈으로 변환
      .trim(); // 앞뒤 공백 제거
  }

  async generateEventDescription(
    requestDto: GeminiEventDescriptionRequestDto,
  ): Promise<string> {
    try {
      // 프롬프트 생성
      const prompt = `너는 이벤트 기획자야. 이벤트 제목은 '${requestDto.title}'이고, 카테고리는 '${requestDto.category}'야. 이 이벤트의 컨셉을 2~3문장으로 캐주얼한 톤으로 매력적으로 설명해줘.`;

      const sanitizedPrompt = this.sanitizePrompt(prompt);
      console.log('sanitizedPrompt', sanitizedPrompt);

      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.0-flash-lite',
        contents: [
          {
            parts: [{ text: sanitizedPrompt }],
          },
        ],
      });
      return response.text;
    } catch (error) {
      throw new Error(`Gemini API 오류: ${error.message}`);
    }
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const sanitizedPrompt = this.sanitizePrompt(prompt);
      console.log('sanitizedPrompt', sanitizedPrompt);

      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.0-flash-lite',
        contents: sanitizedPrompt,
      });
      return response.text;
    } catch (error) {
      throw new Error(`Gemini API 오류: ${error.message}`);
    }
  }

  async generateTextWithHistory(
    prompt: string,
    history: Array<{ role: 'user' | 'model'; parts: string }>,
  ): Promise<string> {
    try {
      const sanitizedPrompt = this.sanitizePrompt(prompt);
      const sanitizedHistory = history.map((item) => ({
        role: item.role,
        parts: [{ text: this.sanitizePrompt(item.parts) }],
      }));

      const contents = [
        ...sanitizedHistory,
        {
          role: 'user',
          parts: [{ text: sanitizedPrompt }],
        },
      ];

      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.0-flash-lite',
        contents,
      });
      return response.text;
    } catch (error) {
      throw new Error(`Gemini API 오류: ${error.message}`);
    }
  }

  async generateEventThumbnail(
    requestDto: GeminiEventThumbnailRequestDto,
  ): Promise<{
    text: string;
    imageBase64: string;
    imageUrl: string;
    fileName: string;
  }> {
    try {
      const { category, title, description } = requestDto;

      // 1. 이미지 프롬프트 생성 요청
      const promptForPrompt = `
너는 이벤트 썸네일을 위한 AI 이미지 프롬프트를 만드는 전문가야.
아래 정보를 참고해서, 영어로, 구체적이고 스타일이 잘 드러나게, 텍스트/로고 없이, 썸네일에 어울리는 프롬프트 한 줄만 만들어줘.

이벤트 제목: ${title}
카테고리: ${category}
설명: ${description}
`;

      const promptResult = await this.genAI.models.generateContent({
        model: 'gemini-2.0-flash-lite',
        contents: [{ parts: [{ text: this.sanitizePrompt(promptForPrompt) }] }],
      });

      const imagePrompt = promptResult.text.trim();

      // 2. 실제 이미지 생성
      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.0-flash-preview-image-generation',
        contents: imagePrompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      let text = '';
      let imageBase64 = '';

      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          text = part.text;
        } else if (part.inlineData) {
          imageBase64 = part.inlineData.data;
        }
      }

      let imageUrl: string | undefined = undefined;
      let fileName: string | undefined = undefined;
      if (imageBase64) {
        const { url, fileName: fileName2 } =
          await this.storageService.uploadBase64Image(imageBase64);
        imageUrl = url;
        fileName = fileName2;
      }

      imageBase64 = `data:image/png;base64,${imageBase64}`;

      return { text, imageBase64, imageUrl, fileName };
    } catch (error) {
      throw new Error(`Gemini 이미지 생성 API 오류: ${error.message}`);
    }
  }

  async generateImageDescription(imageBase64: string): Promise<string> {
    try {
      const response = await this.genAI.models.generateContent({
        model: 'gemini-pro-vision',
        contents: [
          {
            parts: [
              { text: '이 이미지를 자세히 설명해주세요.' },
              {
                inlineData: {
                  data: imageBase64,
                  mimeType: 'image/jpeg',
                },
              },
            ],
          },
        ],
      });
      return response.text;
    } catch (error) {
      throw new Error(`Gemini Vision API 오류: ${error.message}`);
    }
  }

  async generateImage(
    prompt: string,
  ): Promise<{ text: string; imageBase64: string }> {
    try {
      const sanitizedPrompt = this.sanitizePrompt(prompt);

      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.0-flash-preview-image-generation',
        contents: sanitizedPrompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      let text = '';
      let imageBase64 = '';

      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          text = part.text;
        } else if (part.inlineData) {
          imageBase64 = part.inlineData.data;
        }
      }

      return { text, imageBase64 };
    } catch (error) {
      throw new Error(`Gemini 이미지 생성 API 오류: ${error.message}`);
    }
  }
}
