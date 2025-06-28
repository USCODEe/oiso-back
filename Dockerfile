# Node.js 18 Alpine 이미지 사용
FROM node:20-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 yarn.lock 복사
COPY package.json yarn.lock ./

# 의존성 설치
RUN yarn install --frozen-lockfile --production=false

# 소스 코드 복사
COPY . .


# TypeScript 빌드
RUN yarn build

# 프로덕션 의존성만 설치
RUN yarn install --frozen-lockfile --production=true && yarn cache clean

# 포트 설정
EXPOSE 8080

# 애플리케이션 실행
CMD ["yarn", "start:prod"] 