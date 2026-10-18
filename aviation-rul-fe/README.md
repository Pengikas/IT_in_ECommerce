# AeroRUL — React frontend

Frontend B2B marketplace cho động cơ và linh kiện hàng không, dựng lại từ các frame PNG AeroRUL và tài liệu chức năng đã cung cấp. React 18 + Vite + Tailwind CSS + React Router + Recharts. Giao diện tiếng Anh theo thiết kế, responsive cho desktop/tablet/mobile.

## Chạy dự án

Chạy lệnh trong thư mục `aviation-rul-fe`, không phải repository root:

```bash
cd aviation-rul-fe
npm install
npm run dev
```

Vite in địa chỉ localhost trên máy bạn. Có thể dùng `npm ci` thay `npm install` khi đã có lockfile: `ci` xóa node_modules, kiểm tra package.json khớp lockfile và cài đúng các phiên bản đã khóa. `install` thuận tiện khi khởi tạo/thêm/cập nhật dependency và có thể sửa lockfile.

```bash
npm run build
npm run preview
npm run test:e2e
npm run test:api
```

Trên cloud dùng `npm run dev -- --host 0.0.0.0`. Nếu npm cache mặc định không ghi được, thêm `--cache /workspace/.npm-cache` vào lệnh cài dependency.

Tests dùng `/usr/bin/chromium` nếu có. Trên máy khác chạy `npx playwright install chromium`, hoặc đặt `BROWSER_EXECUTABLE_PATH` đến Chromium. Playwright tự khởi động Vite trên port 5173 (demo) và 5174 (API contract test).

## Những gì đã triển khai

- Public: landing, tìm kiếm/filter/sort catalog, category/supplier directory, product detail, seller-offer selection khi API cung cấp, login/register.
- Buyer: dashboard, engine registry/detail, RUL analysis/upload, recommendations + comparison, wishlist, cart/drawer, checkout, orders/tracking, support request local, notifications, profile, settings.
- Supplier: dashboard, tạo/sửa listing, inventory, seller orders/fulfilment, reviews/replies, sales analytics, store profile, settings.
- Admin: dashboard, user/company directory, supplier verification, listing moderation, category CRUD, order overview, reports, system status, settings.
- Mobile: navigation drawer, grid đổi số cột, cards xếp dọc, bảng cuộn trong container; kiểm tra ở 390/768/1440 px.
- Font Inter/JetBrains Mono được bundle cục bộ. Không phụ thuộc Google Fonts runtime.
- Route/page modules và charting được lazy-load. Form có validation, async pending/error state; drawer hỗ trợ Escape và keyboard focus.

## Chế độ demo và API

Mặc định chạy `demo`. Vào `/login`, chọn Buyer/Supplier/Admin, nhập email và mật khẩu bất kỳ. Đây không phải xác thực thật. Mật khẩu demo không được lưu. Dữ liệu demo được lưu dưới key `aerorul_demo_v3`, user session demo dưới `aerorul_user` trong localStorage, tồn tại sau reload. Các role dùng chung cùng một bộ dữ liệu để demo buyer → supplier → buyer.

Muốn reset demo, xóa hai key đó trong DevTools → Application → Local Storage. Wishlist API vẫn là shortlist cục bộ của trình duyệt, chưa có endpoint đồng bộ.

Bật REST API theo [API_INTEGRATION.md](API_INTEGRATION.md). API mode gọi HTTP cho auth/JWT, catalog/listings, server cart, orders, fleet, CSV upload/RUL và supplier fulfilment; không tự fallback sang dữ liệu mẫu khi API lỗi. Các trang chưa có remote contract sẽ hiện `API integration pending`, không hiển thị fake administration data.

**Chưa xác minh server thật:** remote `main` đã kiểm tra ở commit `1d88845` chứa API design, DBML và Python pipeline, chưa có server Express/FastAPI chạy được. Test HTTP chặn request bằng Playwright để kiểm tra adapter; không chứng minh backend/database/model/payment hoạt động.

Demo RUL là giá trị cố định theo sample engine; CSV chỉ được kiểm tra đuôi/dung lượng/số dòng. Không chạy ML, không chẩn đoán bộ phận hỏng và không cung cấp quyết định khai thác hàng không. Compatibility/ranking là dữ liệu minh họa. Thanh toán mô phỏng; support request không gửi tin ra ngoài. Ảnh sản phẩm và logo là vector SVG tạm, chưa có brand/photography gốc riêng.

## Cấu trúc code

```text
src/
  App.jsx                 # Route groups, role guards, page error boundary
  main.jsx                # React / Router / shared state providers
  index.css               # Design tokens, components, responsive rules
  components/
    Shell.jsx             # Header, sidebar, layout, role guard, cart drawer
    UI.jsx                # Forms, fields, loading/error, stats, tables, timeline
    Catalog.jsx           # Product cards và add-to-cart flow
    ProductArt.jsx        # Vector minh họa component
    Charts.jsx            # Sales/RUL charts
    Icon.jsx              # SVG icons
  pages/
    Public.jsx            # Home, auth, marketplace, product detail
    Fleet.jsx             # Buyer dashboard, engine/RUL/recommendation/wishlist
    Commerce.jsx          # Cart, checkout, orders, order detail
    Supplier.jsx          # Seller catalog, inventory, fulfilment, insights
    Admin.jsx             # Platform management
    Account.jsx           # Notifications, profiles, settings
  services/
    config.js             # VITE_DATA_SOURCE và API base URL
    api.js                # HTTP transport, DTO mapping, remote adapters
    seed.js               # Sample datasets
    store.jsx             # Demo persistence và shared domain actions/query hook
```

Các màn hình được gom theo module để dùng chung component, không phải thiếu code vì không còn một file riêng cho mỗi trang như scaffold cũ.

## Branch, workspace và lưu code

Làm việc trên branch **`Frontend`** (F viết hoa). Branch là phiên bản của toàn repository, không phải một service. Frontend/backend có thể nằm trong hai folder của một repo hoặc hai repo độc lập và vẫn giao tiếp qua REST API; không cần chia thành hai branch để chúng chạy độc lập.

Folder ngoài repository như `attachments`, `artifacts`, `.npm-cache`, `shared`, `scratch` là file upload, ảnh/test output, cache hoặc thư mục nền tảng; không phải backend. Root package-lock.json của scaffold không có package; chạy npm trong `aviation-rul-fe`.

Không dựa vào file ZIP tạm hoặc working tree chưa commit để giữ code. Kiểm tra:

```bash
git branch --show-current
git status -sb
git log -1 --oneline
```

Một commit chỉ bền trên remote sau khi push thành công. Nếu panel Changes trống sau commit, đó có thể là trạng thái đúng: code đã commit nên working tree sạch. Xem Files hoặc commit trên GitHub để đọc toàn bộ source.
