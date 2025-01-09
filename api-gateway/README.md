# API Gateway

API Gateway là một phần quan trọng trong kiến trúc microservices, chịu trách nhiệm xử lý các yêu cầu từ client và chuyển tiếp chúng đến các dịch vụ backend tương ứng.

## Nội Dung

- [Giới thiệu](#giới-thiệu)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)

## Giới Thiệu

API Gateway cung cấp một điểm truy cập duy nhất cho tất cả các yêu cầu từ client, giúp quản lý và điều phối các yêu cầu đến các dịch vụ backend như user-service, product-service, v.v.

## Cài Đặt

### Prerequisites

- Node.js (>=14.x)
- NPM hoặc Yarn

### Cài Đặt Dự Án

```bash
git clone <repository-url>
cd api-gateway
npm install
npm run dev
```

### Cấu hình

Cấu hình các service được đặt trong **src/routers/index.js**
Service URL được đặt trong file **.env**
