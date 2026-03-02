#PC Builder E-Commerce Platform

Ứng dụng web cho phép người dùng tự do tùy biến, xây dựng và mua sắm cấu hình máy tính cá nhân. Dự án được tích hợp các tính năng nâng cao như kiểm tra độ tương thích phần cứng và AI Chatbot.

## Tính năng nổi bật

### Smart PC Builder (Xây dựng cấu hình)
- **Kiểm tra tương thích thời gian thực:** Thuật toán tự động kiểm tra xem CPU có khớp với Mainboard không, nguồn (PSU) có đủ công suất không, v.v.
- **Tối ưu hóa ngân sách:** Gợi ý linh kiện phù hợp với ngân sách của người dùng.

### Chatbot
- Tích hợp Chatbot sử dụng Vector Embeddings để phân tích ngữ nghĩa.
- Hỗ trợ giải đáp các thắc mắc về kỹ thuật và tư vấn lựa chọn linh kiện phù hợp với nhu cầu.

###  E-Commerce & Thanh toán
- Quản lý giỏ hàng  và lịch sử đơn hàng.
- Hệ thống áp dụng mã giảm giá (Coupon).
- Tích hợp cổng thanh toán an toàn(Stripe).

###  Bảo mật & Quản trị (Admin Dashboard)
- Hệ thống xác thực người dùng bằng **JWT**.
- Phân quyền User / Admin.
- **Admin Dashboard:** Cung cấp giao diện trực quan để quản lý Sản phẩm, Đơn hàng , Người dùng  và Mã giảm giá.

###  Trải nghiệm người dùng
- Hỗ trợ đa ngôn ngữ (Tiếng Việt, Tiếng Anh, Tiếng Nhật) thông qua `i18n`.
- Chuyển đổi linh hoạt giao diện Sáng / Tối .

---

## Công nghệ sử dụng (Tech Stack)

**Frontend:**
- [React.js](https://reactjs.org/) (Vite)
- State Management: Context API
- Styling:  CSS Thuần
- Đa ngôn ngữ: `react-i18next`

**Backend:**
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- Database: [MongoDB](https://www.mongodb.com/) & Mongoose
- Authentication: JWT, bcryptjs
- AI/Tìm kiếm: Vector Search Services

---
