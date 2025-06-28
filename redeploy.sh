#!/bin/bash

# Google Cloud 프로젝트 ID 설정
PROJECT_ID="your-project-id"
REGION="asia-northeast3"
SERVICE_NAME="oiso-backend"

echo "🔄 Google Cloud Run 재배포 시작..."

# 1. Google Cloud 프로젝트 설정
echo "📋 프로젝트 설정 중..."
gcloud config set project $PROJECT_ID

# 2. 기존 서비스 삭제 (있다면)
echo "🗑️ 기존 서비스 삭제 중..."
gcloud run services delete $SERVICE_NAME --region=$REGION --quiet 2>/dev/null || echo "기존 서비스가 없습니다."

# 3. Docker 이미지 빌드 및 푸시
echo "🐳 Docker 이미지 빌드 중..."
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"
gcloud builds submit --tag $IMAGE_NAME

# 4. Cloud Run에 배포
echo "🚀 Cloud Run에 배포 중..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production

echo "✅ 재배포 완료!"
echo "🌐 서비스 URL: $(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')" 