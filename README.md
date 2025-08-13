# 🎭 Playwright “Edge Cases” Project

A drop-in suite of **tagged edge-case tests** organized in folders.  
Run subsets using grep tags like `@network`.  

## 📂 Structure  
```
playwright-edge-cases/
├─ 📦 package.json
├─ ⚙️ playwright.config.ts
├─ 📄 README.md
└─ 🧪 tests/
   ├─ 🛠 utils/
   │  └─ 🌐 network.ts
   ├─ 🌐 network/
   │  └─ network.spec.ts
   ├─ ⏳ time/
   │  └─ time.spec.ts
   ├─ 🌍 locale/
   │  └─ locale_accessibility.spec.ts
   ├─ 🔐 auth/
   │  └─ auth_session.spec.ts
   ├─ 🖥 ui/
   │  └─ ui_dom.spec.ts
   ├─ 📂 files/
   │  └─ uploads_downloads.spec.ts
   ├─ 📊 data/
   │  └─ data_validation.spec.ts
   ├─ 💾 storage/
   │  └─ storage_pwa.spec.ts
   └─ 🛡 security/
      └─ security.spec.ts
```

## 📋 Prerequisites  
- 🟢 Node 18+  
- 💻 Your app running locally (or set `BASE_URL`)  

## 📦 Install  
```bash
npm i -D @playwright/test
npx playwright install --with-deps
```

## 🔧 Configure Base URL (optional)  
```bash
export BASE_URL="http://localhost:3000"
```

## ▶️ Run All Tests  
```bash
npx playwright test
```

## 🎯 Run by Tag  
```bash
npx playwright test -g "@network"
# Also available: @time @locale @auth @ui @uploads @data @storage @security
```

## 🖥 UI Mode  
```bash
npx playwright test --ui
```

## 💡 Notes  
- 📝 Swap selectors/routes to match your app (e.g., `/orders`, `/checkout`).  
- 🔄 Tests prefer network routing/mocking to stay deterministic.  
- 🎨 Project matrix covers dark mode + es-MX, reduced motion (Firefox), RTL mobile (WebKit), and high-contrast.  

---

# ☁️ Playwright AWS Edge Cases  

A collection of **edgy, integration-flavored tests** for common AWS services using Playwright's test runner.  
All tests are **opt-in** — they check required environment variables and `test.skip()` if missing,  
so you can enable only the services you use.  

## 📦 Install AWS SDK Packages  
```bash
npm i -D @playwright/test
npm i @aws-sdk/client-s3 @aws-sdk/s3-request-presigner       @aws-sdk/client-lambda @aws-sdk/client-dynamodb       @aws-sdk/client-sqs @aws-sdk/client-sns       @aws-sdk/client-eventbridge       @aws-sdk/client-cloudfront       @aws-sdk/client-cognito-identity-provider
```
*(Install only the ones you plan to run)*  

## 🌍 Environment Variables  
```
AWS_REGION=us-east-1
# S3
S3_BUCKET=my-bucket

# Lambda
LAMBDA_FN=my-func-name

# DynamoDB
DDB_TABLE=my-table
DDB_GSI_NAME=byStatus  # optional

# API Gateway
API_URL=https://abc123.execute-api.us-east-1.amazonaws.com/prod

# CloudFront
CF_PUBLIC_URL=https://d111111abcdef8.cloudfront.net/some-asset.txt
CF_DISTRIBUTION_ID=E123ABC456   # optional

# Cognito
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
COGNITO_USERNAME=test@example.com
COGNITO_PASSWORD=CorrectHorseBatteryStaple

# SQS/SNS
SQS_URL=https://sqs.us-east-1.amazonaws.com/123456789012/my-queue
SQS_FIFO_URL=https://sqs.us-east-1.amazonaws.com/123456789012/my-queue.fifo
SNS_TOPIC_ARN=arn:aws:sns:us-east-1:123456789012:my-topic
```

## 🏷 Tags  
- 📦 `@aws @s3` — S3 upload/download, presigned URLs, multipart edge cases  
- ⚡ `@aws @lambda` — Lambda happy/bad payload, large payload, throttling  
- 📊 `@aws @ddb` — DynamoDB CRUD, conditional writes, transactions, GSI query  
- 🌐 `@aws @apigw` — API Gateway schema, 429 retry, CORS  
- ✉️ `@aws @sqs @sns` — messaging, FIFO deduplication, visibility timeout, DLQ  
- 🚀 `@aws @cf` — CloudFront cache headers, HTTPS, optional invalidation  
- 🔐 `@aws @cognito` — auth flows (USER_PASSWORD_AUTH), refresh token tests  
- 📅 `@aws @events` — EventBridge PutEvents edge cases  

## ▶️ Run Tests  
```bash
# Only S3
npx playwright test -g "@aws @s3"

# All AWS
npx playwright test -g "@aws"
```
