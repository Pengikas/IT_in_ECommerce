# AeroRUL — React frontend

Frontend B2B marketplace cho động cơ và linh kiện hàng không, dựng lại từ các frame PNG AeroRUL và tài liệu chức năng đã cung cấp. React 18 + Vite + Tailwind CSS + React Router + Recharts. Giao diện tiếng Anh theo thiết kế, responsive cho desktop/tablet/mobile.

## Chạy dự án

Chạy lệnh trong thư mục `Frontend_code`, không phải repository root:

```bash
cd Frontend_code
npm install
npm run dev
```

Vite in địa chỉ localhost trên máy bạn. Có thể dùng `npm ci` thay `npm install` khi đã có lockfile: `ci` xóa node_modules, kiểm tra package.json khớp lockfile và cài đúng các phiên bản đã khóa. `install` thuận tiện khi khởi tạo/thêm/cập nhật dependency và có thể sửa lockfile.

```bash
npm run build
npm run preview
```

Trên cloud dùng `npm run dev -- --host 0.0.0.0`. Nếu npm cache mặc định không ghi được, thêm `--cache /workspace/.npm-cache` vào lệnh cài dependency.

Tests dùng `/usr/bin/chromium` nếu có. Trên máy khác chạy `npx playwright install chromium`, hoặc đặt `BROWSER_EXECUTABLE_PATH` đến Chromium. Playwright tự khởi động Vite trên port 5173 (demo) và 5174 (API contract test).

## Setting library
```bash
npm install react-router-dom@6 recharts
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

## Những gì đã triển khai

- Public: landing, tìm kiếm/filter/sort catalog, category/supplier directory, product detail, seller-offer selection khi API cung cấp, login/register.
- Buyer: dashboard, engine registry/detail, RUL analysis/upload, recommendations + comparison, wishlist, cart/drawer, checkout, orders/tracking, support request local, notifications, profile, settings.
- Supplier: dashboard, tạo/sửa listing, inventory, seller orders/fulfilment, reviews/replies, sales analytics, store profile, settings.
- Admin: dashboard, user/company directory, supplier verification, listing moderation, category CRUD, order overview, reports, system status, settings.
- Mobile: navigation drawer, grid đổi số cột, cards xếp dọc, bảng cuộn trong container; kiểm tra ở 320/390/768/1440 px.
- Font Inter/JetBrains Mono được bundle cục bộ. Không phụ thuộc Google Fonts runtime.
- Route/page modules và charting được lazy-load. Form có validation, async pending/error state; drawer hỗ trợ Escape và keyboard focus.

## Chế độ demo và API

Mặc định chạy `demo`. Sign in **kiểm tra email và mật khẩu**, không chọn role ở màn hình đăng nhập. Role lấy từ tài khoản; sai thông tin hoặc tài khoản bị suspend sẽ bị từ chối.

| Role | Email mẫu | Mật khẩu demo công khai |
| --- | --- | --- |
| Buyer | procurement@skywest-demo.com | Buyer@2026! |
| Supplier | seller@safran-demo.com | Supplier@2026! |
| Admin | admin@aerorul-demo.com | Admin@2026! |

Đăng ký mới chỉ cho Buyer/Supplier, kiểm tra email trùng (không phân biệt hoa/thường), xác nhận mật khẩu và các trường bắt buộc. Tài khoản mới không có sẵn đơn mua, giỏ hàng, wishlist, fleet, lịch sử phân tích hay thông báo của tài khoản mẫu. Catalog/supplier directory là dữ liệu công khai dùng chung; đơn đặt hàng của Buyer được Supplier tương ứng nhìn thấy để xử lý và Admin nhìn thấy để quản lý.

Dữ liệu demo lưu trong **localStorage của trình duyệt**, key `aerorul_demo_v4`; session demo key `aerorul_session_v4` chỉ lưu ID tài khoản. Sign up không ghi vào file JavaScript: trình duyệt không có quyền sửa source đang phục vụ. Mật khẩu đăng ký lưu dưới dạng PBKDF2-SHA256, salt ngẫu nhiên riêng, 100.000 vòng; không lưu plaintext. Xác thực demo cần localhost hoặc HTTPS để dùng Web Crypto. Đây vẫn là mô phỏng phía client; người dùng có thể sửa localStorage. Xác thực và phân quyền production phải do backend thực hiện. Đổi máy/trình duyệt/origin sẽ không mang theo tài khoản demo.

Bật REST API theo [API_INTEGRATION.md](API_INTEGRATION.md). API mode gọi HTTP cho auth/JWT, catalog/listings, server cart, orders, fleet, CSV upload/RUL và supplier fulfilment; không tự fallback sang dữ liệu mẫu khi API lỗi. Các trang chưa có remote contract sẽ hiện `API integration pending`, không hiển thị fake administration data.

## Cấu trúc code

```text
src/
  app/             # Provider, context và menu theo role
  components/
    common/        # Header, Sidebar, form, button, field, table, trạng thái
    marketplace/   # ProductCard và ProductArt
    engine/        # RULTrendChart
    charts/        # SalesChart
    order/         # CartDrawer, checkout steps, order timeline
  data/mock/       # Catalog, fleet, orders, users, reports và notifications mẫu
  hooks/           # Đọc dữ liệu, giỏ hàng, wishlist và app context
  layouts/         # Public / Buyer / Supplier / Admin và shell dùng chung
  pages/
    public/        # Mỗi màn hình public/auth một file
    buyer/         # Mỗi màn hình Buyer một file
    supplier/      # Mỗi màn hình Supplier một file
    admin/         # Mỗi màn hình Admin một file
    shared/        # Profile và Settings dùng chung giữa các role
  routes/          # ProtectedRoute theo role
  services/
    demo/          # Tạo DB mẫu, auth, queries và mutations local
    api.js         # HTTP client, mapping và REST adapters
    config.js      # Chọn demo/API và API URL
  utils/           # Format giá/ngày và các trạng thái đơn
  App.jsx          # Ghép route + lazy loading + error boundary
  main.jsx         # Khởi động React/Router/Provider
  index.css        # Design system và responsive breakpoints
```

**[FILE_STRUCTURE.md](FILE_STRUCTURE.md) giải thích từng file trong cây thư mục thực tế.**

Header navy tối, sidebar xanh xám, content sáng và card trắng. Sidebar desktop có nút thu gọn/mở rộng, giữ lựa chọn khi reload; mobile có drawer đóng bằng nút, Escape hoặc backdrop. Các trường bắt buộc có sao đỏ và chú thích cuối form; trường tùy chọn không gắn sao. Bảng rộng cuộn trong vùng riêng.

## Các điều chỉnh theo góp ý ngày 19/10/2026

- Cart badge hiển thị **tổng quantity**, không chỉ số dòng sản phẩm; cập nhật khi add/update/remove/place order và reload, cho cả demo/API.
- Replacement chọn engine → category → reference product → **Find replacement**. Kết quả chỉ cùng model tương thích, category và replacementGroup; turbine blade không so sánh lẫn combustor/bearing/sensor. Đổi selection sẽ ẩn kết quả cũ cho đến khi tìm lại. Fleet mẫu có CFM56-7B và V2500; có thêm hai sản phẩm thay thế cùng loại để thử so sánh. RUL không tự xác định bộ phận hỏng.
- DB giữ key v4, bổ sung schemaRevision 5 qua migration: giữ accounts/cart/orders và status/stock đã chỉnh; bổ sung group metadata/examples, chỉ gán V2500 engine cho buyer mẫu. Hai seed orders được bổ sung business/tax/PO/invoice minh họa có nhãn Sample order; không tự bịa thông tin cho đơn người dùng tạo. Không cần xóa localStorage.
- Supplier Orders có **View order** dẫn tới `/supplier/orders/:id`. Trang chi tiết chỉ hiện hàng của seller; có Buyer/company/tax ID/PO/billing/shipping/payment. Xác nhận yêu cầu tick đã review; shipping yêu cầu carrier/tracking, Buyer thấy tracking sau đó. Các amount thuế/freight chưa có không bị xem là 0.
- Payment có form riêng cho **Invoice / Bank transfer / Card**. Invoice lấy billing contact/email/address và thông tin thuế/PO; bank thêm transfer reference và instructions; card chỉ có thẻ thử nghiệm định sẵn và test authorization. **Không thu thập/lưu PAN/CVV/bank credential, không thu tiền thật.** API card mode chặn checkout khi chưa có backend/provider session; bank transfer không tự thành paid.
- Tài liệu UI/UX gốc, mục **7.8 Cart & Checkout**, có “Payment / Payment Simulation” nhưng chưa chỉ định payment gateway hoặc bộ trường theo method. Luồng frontend mới cụ thể hóa phần đó; merchant/backend/webhook/thuế thật vẫn cần triển khai riêng.
- Header bỏ badge Demo workspace không tương tác (mode nằm trong account menu); nút Search bấm được, lịch sử riêng theo user dùng dropdown tối, tắt native autocomplete và sửa autofill text/background.
- Sidebar bỏ company card lặp thông tin header. Chỉ menu cuộn, Sign out cố định đáy; giữ collapse/expand desktop và drawer mobile.
- Support form trên Buyer order detail có label cho cả hai field, input/select/button cùng chiều cao và xếp dọc trên màn nhỏ. Engine status có icon lớn hơn, màu đỏ/vàng/xanh rõ hơn; các warning/critical badge tăng tương phản vừa phải.

