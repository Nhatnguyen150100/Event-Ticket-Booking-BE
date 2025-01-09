# Dự Án Đặt Vé Sự Kiện

Dự án này là một hệ thống microservice cho việc đặt vé sự kiện, được xây dựng bằng Node.js và Express.js. Hệ thống cho phép người dùng tìm kiếm, đặt vé cho các sự kiện và quản lý vé một cách hiệu quả.

## Nội Dung

- [Giới thiệu](#giới-thiệu)
- [Kiến Trúc Dự Án](#kiến-trúc-dự-án)
- [Cài Đặt](#cài-đặt)
- [Cấu Hình](#cấu-hình)
- [Microservices](#microservices)
- [Endpoints](#endpoints)
- [Sử Dụng](#sử-dụng)
- [Logging](#logging)
- [Lỗi Thường Gặp](#lỗi-thường-gặp)
- [Liên Hệ](#liên-hệ)

## Giới Thiệu

Dự án đặt vé sự kiện cho phép người dùng:

- Tìm kiếm các sự kiện.
- Đặt vé cho các sự kiện.
- Quản lý vé đã đặt.

Hệ thống được chia thành nhiều microservice để tối ưu hóa hiệu suất và khả năng mở rộng.

## Kiến Trúc Dự Án

Dự án được tổ chức theo kiến trúc microservices, với các thành phần chính bao gồm:

project-directory/
├── api-gateway/ # API Gateway
├── user-service/ # Dịch vụ xác thực người dùng
├── event-service/ # Dịch vụ quản lý sự kiện
├── ticket-service/ # Dịch vụ quản lý vé
├── user-service/ # Dịch vụ quản lý người dùng
├── config/ # Cấu hình chung
├── docker-compose.yml # Docker Compose file
├── .env # Biến môi trường
├── package.json # Thông tin dự án
├── README.md # Tài liệu dự án

## Cài Đặt

### Prerequisites

- Node.js (>=14.x)
- NPM hoặc Yarn
- Docker (nếu sử dụng Docker)

### Cài Đặt Dự Án

```bash
git clone <repository-url>
cd <project-directory>
npm install
```

### Biến Môi Trường

Tạo một file .env trong thư mục gốc của dự án và thêm các biến sau:

PORT=8000
AUTH_SERVICE_URL=http://localhost:8001
EVENT_SERVICE_URL=http://localhost:8002
TICKET_SERVICE_URL=http://localhost:8003
BASE_URL_CLIENT=http://localhost:3000

### Microservices

## Microservices

1. **API Gateway**  
   API Gateway là điểm truy cập duy nhất cho tất cả các yêu cầu từ client. Nó chuyển tiếp yêu cầu đến các dịch vụ tương ứng.

2. **Auth Service**  
   Dịch vụ xác thực người dùng, cung cấp các chức năng như đăng nhập, đăng ký và quản lý người dùng.

3. **Event Service**  
   Dịch vụ quản lý sự kiện, cho phép tạo, cập nhật và xóa sự kiện.

4. **Ticket Service**  
   Dịch vụ quản lý vé, cho phép đặt và quản lý vé cho các sự kiện.

### Endpoints

API Gateway
Phương Thức Đường Dẫn Mô Tả
POST /auth/login Đăng nhập
POST /auth/register Đăng ký
GET /events Lấy danh sách sự kiện
POST /events Tạo sự kiện
GET /events/:id Lấy thông tin sự kiện theo ID
POST /tickets Đặt vé cho sự kiện
GET /tickets/:userId Lấy danh sách vé của người dùng

### Logging

Hệ thống sử dụng winston để ghi lại thông tin về các yêu cầu và lỗi. Bạn có thể tìm thấy logs trong console và có thể cấu hình để ghi vào file.

### Lỗi Thường Gặp

Cổng không hoạt động: Đảm bảo rằng tất cả các dịch vụ backend đang chạy trên cổng đúng.

### Lỗi 404: Đảm bảo rằng bạn đang gọi đúng endpoint.

Không thể kết nối đến dịch vụ: Kiểm tra URL của dịch vụ trong biến môi trường.

### Liên Hệ

Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với tôi qua email: nhatnguyen150100@gmail.com.
