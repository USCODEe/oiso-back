<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# OISO Backend

NestJS 기반의 백엔드 API 서버입니다.

## 설치

```bash
$ yarn install
```

## 환경 변수 설정

프로젝트 루트에 `.env.development` 파일을 생성하고 다음 환경 변수들을 설정하세요:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=oiso
DB_SYNC=false
DB_LOGGING=false

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-jwt-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Google Gemini Configuration
GEMINI_API_KEY=your-gemini-api-key

# Application Configuration
NODE_ENV=development
PORT=3000
```

### Google Gemini API 키 발급 방법

1. [Google AI Studio](https://makersuite.google.com/app/apikey)에 접속
2. Google 계정으로 로그인
3. "Create API Key" 버튼 클릭
4. 생성된 API 키를 `GEMINI_API_KEY` 환경 변수에 설정

## 앱 실행

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Google Cloud 배포

### 사전 준비

1. **Google Cloud SDK 설치**

   ```bash
   # macOS
   brew install google-cloud-sdk

   # 또는 공식 설치 스크립트 사용
   curl https://sdk.cloud.google.com | bash
   ```

2. **Google Cloud 프로젝트 생성**

   - [Google Cloud Console](https://console.cloud.google.com/)에서 새 프로젝트 생성
   - 프로젝트 ID를 기억해두세요

3. **인증 설정**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

### 배포 방법

#### 방법 1: 스크립트 사용 (추천)

```bash
# deploy.sh 파일에서 PROJECT_ID 수정
vim deploy.sh

# 배포 실행
./deploy.sh
```

#### 방법 2: 수동 배포

```bash
# 1. Docker 이미지 빌드 및 푸시
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/oiso-backend

# 2. Cloud Run에 배포
gcloud run deploy oiso-backend \
  --image gcr.io/YOUR_PROJECT_ID/oiso-backend \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10
```

### 환경 변수 설정 (Cloud Run)

배포 후 Google Cloud Console에서 환경 변수를 설정하세요:

1. Cloud Run 서비스 페이지로 이동
2. "편집 및 배포" 클릭
3. "변수 및 시크릿" 탭에서 환경 변수 추가:
   - `GEMINI_API_KEY`
   - `JWT_SECRET`
   - `DB_HOST` (Cloud SQL 사용 시)
   - 기타 필요한 환경 변수들

### 데이터베이스 연결 (Cloud SQL)

Google Cloud SQL을 사용하려면:

1. **Cloud SQL 인스턴스 생성**
2. **연결 설정**:
   ```bash
   gcloud run services update oiso-backend \
     --add-cloudsql-instances YOUR_PROJECT_ID:REGION:INSTANCE_NAME
   ```

## API 엔드포인트

### Gemini API

#### 텍스트 생성

```http
POST /gemini/text
Content-Type: application/json

{
  "prompt": "안녕하세요! 오늘 날씨에 대해 이야기해주세요."
}
```

#### 대화형 텍스트 생성

```http
POST /gemini/chat
Content-Type: application/json

{
  "prompt": "이전 대화를 기억하고 답변해주세요.",
  "history": [
    {
      "role": "user",
      "parts": "안녕하세요"
    },
    {
      "role": "model",
      "parts": "안녕하세요! 무엇을 도와드릴까요?"
    }
  ]
}
```

#### 이미지 분석

```http
POST /gemini/image
Content-Type: application/json

{
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
}
```

#### 이미지 생성

```http
POST /gemini/generate-image
Content-Type: application/json

{
  "prompt": "3D 렌더링된 날개 달린 돼지가 미래적인 도시 위를 날아가는 모습"
}
```

### 인증 API

#### 로그인

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Google OAuth 로그인

```http
GET /auth/google
```

#### 토큰 갱신

```http
POST /auth/refresh
```

#### 로그아웃

```http
POST /auth/logout
```

#### 현재 사용자 정보

```http
GET /auth/me
Authorization: Bearer <access_token>
```

## 테스트

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## API 문서

서버 실행 후 다음 URL에서 Swagger API 문서를 확인할 수 있습니다:

```
http://localhost:3000/api
```

## 라이선스

MIT 라이선스입니다.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
