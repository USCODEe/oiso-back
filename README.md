# OISO Backend
![Uploading 51.png…]()

OISO는 다양한 프로젝트(이벤트, 펀딩 등)를 관리하고, 사용자들이 참여할 수 있도록 지원하는 백엔드 API 서버입니다.
NestJS로 개발되었으며, Google Cloud Platform(GCP)의 다양한 서비스를 활용하여 안정적이고 확장성 있는 서비스를 제공합니다.

---

## 프로젝트 개요

- 사용자는 프로젝트(이벤트, 펀딩 등)를 생성하고, 참여 및 결제를 할 수 있습니다.
- 관리자 및 일반 사용자 권한을 구분하여 인증/인가를 제공합니다.
- AI(Google Gemini API)를 활용한 텍스트/이미지 생성 기능을 지원합니다.
- 파일(이미지 등)은 Google Cloud Storage에 안전하게 저장됩니다.

---

## 주요 기술 스택

- **NestJS**: Node.js 기반 백엔드 프레임워크
- **TypeORM + MySQL (Cloud SQL)**: 관계형 데이터베이스 및 ORM
- **Google Kubernetes Engine(GKE)**: 컨테이너 오케스트레이션 및 배포
- **Google Cloud Storage**: 파일(이미지) 저장소
- **Google Gemini API**: AI 텍스트/이미지 생성
- **JWT, Passport**: 인증 및 권한 관리
- **Swagger**: API 문서 자동화

---

## GKE 배포 및 GCP 서비스 연동

- **GKE(Google Kubernetes Engine)**  
  Docker로 빌드한 이미지를 GKE 클러스터에 배포하여, 자동 스케일링과 무중단 배포가 가능합니다.  
  Kubernetes의 Deployment, Service, Ingress 등을 활용해 서비스 트래픽을 관리합니다.

- **Google Cloud Storage**  
  사용자가 업로드한 이미지 등 파일은 Cloud Storage 버킷에 저장되어, 대용량 파일 관리와 보안이 용이합니다.

- **Google Cloud SQL**  
  MySQL 데이터베이스를 Cloud SQL로 운영하여, 데이터의 안정성과 백업, 장애 복구를 지원합니다.

---

## 로컬 개발 및 실행

```bash
yarn install
yarn start:dev
```

---

## GKE 배포 개요

1. **Docker 이미지 빌드 및 푸시**

   ```bash
   docker build -t gcr.io/[PROJECT_ID]/oiso-backend:latest .
   docker push gcr.io/[PROJECT_ID]/oiso-backend:latest
   ```

2. **Kubernetes 리소스 배포**

3. **환경변수 및 시크릿 관리**
   - ConfigMap, Secret을 활용하여 DB, JWT, 외부 API 키 등 관리

---

## API 문서

- Swagger: `/api/docs` 경로에서 확인 가능

---

## 문의

- 담당자: 김지용 (이메일: example@email.com)
