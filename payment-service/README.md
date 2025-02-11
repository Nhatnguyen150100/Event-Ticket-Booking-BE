# E-Commerce Application

Đây là một ứng dụng e-commerce được xây dựng bằng Node.js, Express.js và MongoDB. Ứng dụng này cho phép người dùng duyệt sản phẩm, thêm vào giỏ hàng và thực hiện thanh toán.

## Nội dung

- [Giới thiệu](#giới-thiệu)
- [Yêu cầu](#yêu-cầu)
- [Cài đặt](#cài-đặt)
- [Cách sử dụng](#cách-sử-dụng)
- [Khởi động dự án](#khởi-động-dự-án)
- [Lệnh](#lệnh)
- [Cảm ơn](#cảm-ơn)

## Giới thiệu

Ứng dụng e-commerce này cung cấp một nền tảng cho người dùng để mua sắm trực tuyến. Với việc sử dụng MongoDB làm cơ sở dữ liệu, ứng dụng hỗ trợ lưu trữ và quản lý thông tin sản phẩm, người dùng và đơn hàng.

## Yêu cầu

- Node.js >= 14.x
- NPM >= 6.x
- MongoDB

## Cài đặt

1. Clone repository về máy:

   ```bash
   git clone https://github.com/Nhatnguyen150100/e-commerce-fe.git
   cd e-commerce-fe
   ```

2. Cài đặt các phụ thuộc:

   ```bash
   npm install
   ```

3. Tạo tệp `.env` từ tệp mẫu và cấu hình các biến môi trường:

   ```bash
   cp .env.example .env
   ```

   Điền thông tin kết nối MongoDB và các cấu hình khác.


4. Chạy seeder để thêm dữ liệu db:

   ```bash
   npm run seed
   ```

## Cách sử dụng

- **Chạy ứng dụng trong môi trường phát triển**: Sử dụng lệnh `npm run dev` để khởi động ứng dụng với chế độ phát triển.
- **Xây dựng ứng dụng**: Sử dụng lệnh `npm run build` để biên dịch mã nguồn cho môi trường sản xuất.
- **Chạy ứng dụng trong môi trường sản xuất**: Sử dụng lệnh `npm run production` để khởi động ứng dụng với chế độ sản xuất.

## Khởi động dự án

### Khởi động trong môi trường phát triển

```bash
npm run dev
```

### Xây dựng ứng dụng

```bash
npm run build
```

### Chạy trong môi trường sản xuất

```bash
npm run production
```

## Lệnh

- **Dev**: Chạy ứng dụng trong chế độ phát triển.
- **Build**: Biên dịch mã nguồn cho môi trường sản xuất.
- **Production**: Chạy ứng dụng trong chế độ sản xuất.

## Cảm ơn

Cảm ơn bạn đã xem qua dự án này! Nếu bạn có bất kỳ câu hỏi nào hoặc đề xuất cải tiến, hãy liên hệ với tôi qua [nhatnguyen150100@gmail.com](mailto:nhatnguyen150100@example.com) hoặc mở một vấn đề trên GitHub.
