# Cấu trúc và mục đích từng file AeroRUL frontend

## Luồng dữ liệu

`main.jsx → AppProvider → App.jsx → ProtectedRoute/layout → page → hook → demo query/command hoặc services/api.js → component`.

Trong demo, `database.js` tạo dữ liệu từ `data/mock/` **khi chưa có DB v4**; sau đó localStorage là nguồn trạng thái đang dùng. File dataset không tự đổi khi đăng ký. Account mới được thêm vào `db.users`, password lưu salt/hash, session chỉ lưu ID. Buyer lấy dữ liệu theo `buyerId/ownerId/userId`; Supplier chỉ lấy listing/đơn có sản phẩm của mình. Admin có quyền xem dữ liệu quản trị. Catalog công khai dùng chung là chủ ý; lịch sử cá nhân không dùng chung theo role.

## Cây thư mục đầy đủ

```text
src/
├── app/
│   ├── providers/
│   │   ├── AppContext.js
│   │   └── AppProvider.jsx
│   ├── routes/
│   └── navigation.js
├── components/
│   ├── charts/
│   │   └── SalesChart.jsx
│   ├── common/
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── DataTable.jsx
│   │   ├── EmptyState.jsx
│   │   ├── Field.jsx
│   │   ├── Form.jsx
│   │   ├── Header.jsx
│   │   ├── Icon.jsx
│   │   ├── Loading.jsx
│   │   ├── Logo.jsx
│   │   ├── Notice.jsx
│   │   ├── PageTitle.jsx
│   │   ├── QueryState.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatsGrid.jsx
│   │   └── Urgency.jsx
│   ├── engine/
│   │   └── RULTrendChart.jsx
│   ├── marketplace/
│   │   ├── ProductArt.jsx
│   │   └── ProductCard.jsx
│   └── order/
│       ├── CartDrawer.jsx
│       ├── CheckoutStepper.jsx
│       └── OrderStatusTimeline.jsx
├── data/
│   └── mock/
│       ├── catalog.js
│       ├── fleet.js
│       ├── notifications.js
│       ├── orders.js
│       ├── reports.js
│       └── users.js
├── hooks/
│   ├── useAddCart.js
│   ├── useApp.js
│   ├── useRecords.js
│   └── useWishlist.js
├── layouts/
│   ├── AdminLayout.jsx
│   ├── BuyerLayout.jsx
│   ├── PublicLayout.jsx
│   ├── SupplierLayout.jsx
│   └── WorkspaceLayout.jsx
├── pages/
│   ├── admin/
│   │   ├── Categories.jsx
│   │   ├── Companies.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Orders.jsx
│   │   ├── Products.jsx
│   │   ├── Reports.jsx
│   │   ├── Suppliers.jsx
│   │   ├── SystemStatus.jsx
│   │   └── Users.jsx
│   ├── buyer/
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Dashboard.jsx
│   │   ├── EngineDetail.jsx
│   │   ├── MyEngines.jsx
│   │   ├── Notifications.jsx
│   │   ├── OrderDetail.jsx
│   │   ├── Orders.jsx
│   │   ├── RULAnalysis.jsx
│   │   ├── Recommendations.jsx
│   │   └── Wishlist.jsx
│   ├── public/
│   │   ├── Home.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── Login.jsx
│   │   ├── Marketplace.jsx
│   │   ├── ProductDetail.jsx
│   │   └── Register.jsx
│   ├── shared/
│   │   ├── AccountSettings.jsx
│   │   └── BusinessProfile.jsx
│   └── supplier/
│       ├── Analytics.jsx
│       ├── Dashboard.jsx
│       ├── Inventory.jsx
│       ├── Orders.jsx
│       ├── ProductForm.jsx
│       ├── Products.jsx
│       └── Reviews.jsx
├── routes/
│   └── ProtectedRoute.jsx
├── services/
│   ├── demo/
│   │   ├── auth.js
│   │   ├── commands.js
│   │   ├── database.js
│   │   └── queries.js
│   ├── api.js
│   └── config.js
├── utils/
│   ├── date.js
│   ├── money.js
│   └── orderStages.js
├── App.jsx
├── index.css
└── main.jsx
```

## Từng file source

### `src/./`

| File | Mục đích |
| --- | --- |
| [App.jsx](src/App.jsx) | Khai báo các route, lazy-load từng trang, ghép layout theo role, hiển thị trang 404 và bắt lỗi render. |

### `src/app/`

| File | Mục đích |
| --- | --- |
| [navigation.js](src/app/navigation.js) | Danh sách menu Buyer/Supplier/Admin: nhóm, tên, URL và icon; Sidebar đọc từ đây. |

### `src/app/providers/`

| File | Mục đích |
| --- | --- |
| [AppContext.js](src/app/providers/AppContext.js) | Định nghĩa React context dùng chung, tách khỏi provider để hooks không tạo import cycle. |
| [AppProvider.jsx](src/app/providers/AppProvider.jsx) | Quản lý user/session, notices, cart drawer và DB demo; điều phối login/register/logout, đọc dữ liệu và mutation sang demo hoặc REST API. |

### `src/components/charts/`

| File | Mục đích |
| --- | --- |
| [SalesChart.jsx](src/components/charts/SalesChart.jsx) | Gom tổng order theo tháng và vẽ biểu đồ doanh thu; rỗng khi chưa có đơn. |

### `src/components/common/`

| File | Mục đích |
| --- | --- |
| [Badge.jsx](src/components/common/Badge.jsx) | Nhãn trạng thái nhỏ với tone màu. |
| [Button.jsx](src/components/common/Button.jsx) | Button dùng chung với tone, disabled/pending và bắt lỗi callback bất đồng bộ để báo lỗi. |
| [DataTable.jsx](src/components/common/DataTable.jsx) | Render bảng từ cấu hình cột, hỗ trợ custom cell, empty state và cuộn trong container. |
| [EmptyState.jsx](src/components/common/EmptyState.jsx) | Trạng thái rỗng với tiêu đề, lời giải thích và link quay lại tùy chọn. |
| [Field.jsx](src/components/common/Field.jsx) | Label + input hoặc custom control; nhận diện required để gắn sao đỏ; đặt tên truy cập rõ ràng cho input/select/textarea. |
| [Form.jsx](src/components/common/Form.jsx) | Thu thập FormData, chặn submit mặc định, trạng thái saving/error, khóa controls khi chờ và chú thích required cuối form. |
| [Header.jsx](src/components/common/Header.jsx) | Logo, menu mobile, nút thu gọn sidebar desktop, tìm kiếm toàn cục, cart, notifications và account menu trên nền navy. |
| [Icon.jsx](src/components/common/Icon.jsx) | Thư viện SVG icon nội bộ; nhận tên và kích thước. |
| [Loading.jsx](src/components/common/Loading.jsx) | Placeholder và thông báo loading cho trang/query. |
| [Logo.jsx](src/components/common/Logo.jsx) | Logo AeroRUL SVG/chữ dùng lại ở header, footer và auth shell. |
| [Notice.jsx](src/components/common/Notice.jsx) | Thông báo trạng thái/thành công/lỗi, có role status/alert. |
| [PageTitle.jsx](src/components/common/PageTitle.jsx) | Eyebrow, tiêu đề, mô tả và nút hành động đầu trang. |
| [QueryState.jsx](src/components/common/QueryState.jsx) | Chọn loading/error/retry hoặc nội dung tùy trạng thái query. |
| [Sidebar.jsx](src/components/common/Sidebar.jsx) | Menu theo role, công ty, active route, icon khi thu gọn và đăng xuất; trên mobile hoạt động như drawer. |
| [StatsGrid.jsx](src/components/common/StatsGrid.jsx) | Lưới KPI gồm nhãn, giá trị, icon, chi tiết và highlight cảnh báo. |
| [Urgency.jsx](src/components/common/Urgency.jsx) | Đổi các mức RUL/urgency thành Badge phù hợp. |

### `src/components/engine/`

| File | Mục đích |
| --- | --- |
| [RULTrendChart.jsx](src/components/engine/RULTrendChart.jsx) | Biểu đồ RUL theo cycle bằng Recharts với ngưỡng tham chiếu. |

### `src/components/marketplace/`

| File | Mục đích |
| --- | --- |
| [ProductArt.jsx](src/components/marketplace/ProductArt.jsx) | Minh họa sản phẩm bằng SVG tạm; không phải ảnh sản phẩm gốc. |
| [ProductCard.jsx](src/components/marketplace/ProductCard.jsx) | Card sản phẩm: hình, giá, stock, supplier, wishlist và add-to-cart. |

### `src/components/order/`

| File | Mục đích |
| --- | --- |
| [CartDrawer.jsx](src/components/order/CartDrawer.jsx) | Giỏ hàng bên phải: quantity/remove/subtotal và checkout; hỗ trợ Escape, focus trap và khóa cuộn nền. |
| [CheckoutStepper.jsx](src/components/order/CheckoutStepper.jsx) | Các bước checkout và đánh dấu bước hiện tại. |
| [OrderStatusTimeline.jsx](src/components/order/OrderStatusTimeline.jsx) | Timeline Placed → Delivered, hoặc Badge nếu status ngoài chuỗi. |

### `src/data/mock/`

| File | Mục đích |
| --- | --- |
| [catalog.js](src/data/mock/catalog.js) | PRODUCTS, SUPPLIERS, CATEGORIES: dữ liệu công khai dùng chung cho demo, không phải lịch sử mua của mọi account. |
| [fleet.js](src/data/mock/fleet.js) | ENGINES và RUL_HISTORY mẫu; database gắn ownerId buyer-1, account mới không được gán fleet này. |
| [notifications.js](src/data/mock/notifications.js) | Các thông báo mẫu chỉ phục vụ buyer-1. |
| [orders.js](src/data/mock/orders.js) | ORDERS mẫu, đều có buyerId buyer-1; user mới không thừa hưởng. |
| [reports.js](src/data/mock/reports.js) | Hai report mẫu dành cho Admin. |
| [users.js](src/data/mock/users.js) | Ba tài khoản mẫu với role/active và password salt/hash. Chỉ dùng demo; không chứa password plaintext. |

### `src/hooks/`

| File | Mục đích |
| --- | --- |
| [useAddCart.js](src/hooks/useAddCart.js) | Yêu cầu Buyer đăng nhập, kiểm tra offer khi ở API mode, thêm cart rồi mở drawer hoặc đi checkout. |
| [useApp.js](src/hooks/useApp.js) | Đọc AppContext; không chứa dataset. |
| [useRecords.js](src/hooks/useRecords.js) | Query chung cho các resource: đọc demo theo owner hoặc gọi remote loader; xử lý pending/error và hủy cập nhật khi unmount. |
| [useWishlist.js](src/hooks/useWishlist.js) | Wishlist riêng theo user; demo lưu trong DB, API mode giữ shortlist local theo user ID do chưa có remote endpoint. |

### `src/./`

| File | Mục đích |
| --- | --- |
| [index.css](src/index.css) | Font cục bộ, màu sắc, spacing, component styles, header tối, sidebar hai trạng thái, breakpoints desktop/tablet/mobile và reduced-motion. |

### `src/layouts/`

| File | Mục đích |
| --- | --- |
| [AdminLayout.jsx](src/layouts/AdminLayout.jsx) | Gắn shell cho nhóm route Admin; dùng chung cơ chế layout. |
| [BuyerLayout.jsx](src/layouts/BuyerLayout.jsx) | Gắn shell cho nhóm route Buyer; dùng chung cơ chế layout. |
| [PublicLayout.jsx](src/layouts/PublicLayout.jsx) | Ghép WorkspaceLayout cho route public; người đã đăng nhập xem catalog sẽ có shell theo role. |
| [SupplierLayout.jsx](src/layouts/SupplierLayout.jsx) | Gắn shell cho nhóm route Supplier; dùng chung cơ chế layout. |
| [WorkspaceLayout.jsx](src/layouts/WorkspaceLayout.jsx) | Shell chung: Header/Sidebar/Outlet/footer/notices, trạng thái collapse/mobile drawer, điều hướng và chặn màn API chưa có contract. |

### `src/./`

| File | Mục đích |
| --- | --- |
| [main.jsx](src/main.jsx) | Mount React vào #root; bọc BrowserRouter và AppProvider; nạp CSS toàn cục. |

### `src/pages/admin/`

| File | Mục đích |
| --- | --- |
| [Categories.jsx](src/pages/admin/Categories.jsx) | Tạo/sửa danh mục demo với kiểm tra tên bắt buộc. |
| [Companies.jsx](src/pages/admin/Companies.jsx) | Directory công ty từ tài khoản demo đã có/đã đăng ký. |
| [Dashboard.jsx](src/pages/admin/Dashboard.jsx) | Tổng quan platform: supplier, orders, catalog, doanh thu mẫu và việc cần duyệt. |
| [Orders.jsx](src/pages/admin/Orders.jsx) | Tổng quan tất cả đơn của platform. |
| [Products.jsx](src/pages/admin/Products.jsx) | Moderation catalog: xem listing, đổi trạng thái/ẩn và thông tin kiểm duyệt. |
| [Reports.jsx](src/pages/admin/Reports.jsx) | Danh sách report mẫu và chuyển Open/Resolved. |
| [Suppliers.jsx](src/pages/admin/Suppliers.jsx) | Danh sách Supplier và thao tác approve/revoke verification demo. |
| [SystemStatus.jsx](src/pages/admin/SystemStatus.jsx) | Trình bày trạng thái tích hợp frontend/RUL/API theo thực tế; không giả server/model đang chạy. |
| [Users.jsx](src/pages/admin/Users.jsx) | Danh sách account demo; lọc/search và suspend/restore, không cho suspend admin mẫu. |

### `src/pages/buyer/`

| File | Mục đích |
| --- | --- |
| [Cart.jsx](src/pages/buyer/Cart.jsx) | Giỏ hàng riêng: chỉnh quantity, remove, tổng tiền và link checkout. |
| [Checkout.jsx](src/pages/buyer/Checkout.jsx) | Form nhiều bước: company/shipping, delivery, payment demo, review/confirmation và tạo đơn. |
| [Dashboard.jsx](src/pages/buyer/Dashboard.jsx) | KPI fleet/order/wishlist của Buyer đang đăng nhập, cảnh báo RUL, bảng engines và đơn gần đây. |
| [EngineDetail.jsx](src/pages/buyer/EngineDetail.jsx) | Thông tin và lịch sử RUL của một engine thuộc fleet; có empty state nếu không có quyền hoặc không tồn tại. |
| [MyEngines.jsx](src/pages/buyer/MyEngines.jsx) | Danh sách engine thuộc account, tìm kiếm/lọc urgency và link engine detail/RUL. |
| [Notifications.jsx](src/pages/buyer/Notifications.jsx) | Thông báo riêng; tài khoản mẫu có thông báo mẫu, account mới rỗng; trạng thái đã đọc theo user. |
| [OrderDetail.jsx](src/pages/buyer/OrderDetail.jsx) | Chi tiết đơn có kiểm tra owner ở query: items, tracking, delivery, tổng và support request local. |
| [Orders.jsx](src/pages/buyer/Orders.jsx) | Danh sách đơn thuộc Buyer với tìm kiếm, lọc status và timeline. |
| [RULAnalysis.jsx](src/pages/buyer/RULAnalysis.jsx) | Chọn engine của user, upload CSV, kiểm tra sơ bộ file demo, chạy demo/API prediction và xem kết quả/history của user. |
| [Recommendations.jsx](src/pages/buyer/Recommendations.jsx) | Chọn engine thuộc user, xem các linh kiện thay thế tương thích và so sánh giá/stock/delivery/supplier. |
| [Wishlist.jsx](src/pages/buyer/Wishlist.jsx) | Lọc catalog theo shortlist riêng của Buyer, hỗ trợ bỏ lưu và add-to-cart. |

### `src/pages/public/`

| File | Mục đích |
| --- | --- |
| [Home.jsx](src/pages/public/Home.jsx) | Landing: hero, category, sản phẩm nổi bật, supplier network và giới thiệu quy trình. |
| [HowItWorks.jsx](src/pages/public/HowItWorks.jsx) | Giải thích Analyse → Understand → Compare → Source; hỗ trợ bản compact trên Home. |
| [Login.jsx](src/pages/public/Login.jsx) | Email/password, hiện/ẩn password, xử lý lỗi và đi dashboard theo role tài khoản; hiển thị demo credentials. |
| [Marketplace.jsx](src/pages/public/Marketplace.jsx) | Catalog có search/filter/sort; tabs danh mục và supplier; trạng thái không có kết quả. |
| [ProductDetail.jsx](src/pages/public/ProductDetail.jsx) | Chi tiết sản phẩm, spec/compatibility, chọn offer API, quantity/cart/buy, reviews và viết review demo. |
| [Register.jsx](src/pages/public/Register.jsx) | Chọn Buyer/Supplier, thông tin tài khoản/công ty, confirm password/terms và tạo account. |

### `src/pages/shared/`

| File | Mục đích |
| --- | --- |
| [AccountSettings.jsx](src/pages/shared/AccountSettings.jsx) | Tùy chọn notification riêng theo user và thông tin session; không giả lập đổi mật khẩu qua backend. |
| [BusinessProfile.jsx](src/pages/shared/BusinessProfile.jsx) | Form company/store profile dùng lại giữa Buyer và Supplier, đọc/ghi riêng theo user ID. |

### `src/pages/supplier/`

| File | Mục đích |
| --- | --- |
| [Analytics.jsx](src/pages/supplier/Analytics.jsx) | Doanh thu, giá trị đơn, hiệu suất sản phẩm từ đơn của Supplier; không dựng doanh thu giả cho user mới. |
| [Dashboard.jsx](src/pages/supplier/Dashboard.jsx) | KPI, đơn và doanh thu của cửa hàng đăng nhập; chỉ lấy phần items thuộc Supplier trong đơn nhiều seller. |
| [Inventory.jsx](src/pages/supplier/Inventory.jsx) | Tồn kho listing thuộc Supplier, kiểm tra số nguyên không âm và lưu cập nhật. |
| [Orders.jsx](src/pages/supplier/Orders.jsx) | Đơn có hàng của Supplier, lọc riêng items và cập nhật tiến độ fulfilment của seller. |
| [ProductForm.jsx](src/pages/supplier/ProductForm.jsx) | Tạo/sửa listing: product, SKU/category/compatibility ở demo; giá/stock/delivery/status; ảnh chỉ preview local. |
| [Products.jsx](src/pages/supplier/Products.jsx) | Bảng listing riêng, search/filter và link tạo/sửa. |
| [Reviews.jsx](src/pages/supplier/Reviews.jsx) | Review cho sản phẩm của Supplier, hiển thị và lưu phản hồi demo. |

### `src/routes/`

| File | Mục đích |
| --- | --- |
| [ProtectedRoute.jsx](src/routes/ProtectedRoute.jsx) | Đợi kiểm tra session, chuyển người chưa login về /login và chuyển sai role về dashboard phù hợp. Backend vẫn phải phân quyền request. |

### `src/services/`

| File | Mục đích |
| --- | --- |
| [api.js](src/services/api.js) | HTTP client timeout/JSON/multipart/JWT/401/CSRF, mapping DTO và load/command cho auth/catalog/cart/order/fleet/RUL/supplier. |
| [config.js](src/services/config.js) | Đọc VITE_DATA_SOURCE và VITE_API_BASE_URL để chọn demo/API. |

### `src/services/demo/`

| File | Mục đích |
| --- | --- |
| [auth.js](src/services/demo/auth.js) | Chuẩn hóa email, PBKDF2 password, xác thực account/active, kiểm tra đăng ký và bỏ passwordHash/salt khỏi user session. |
| [commands.js](src/services/demo/commands.js) | Các mutation demo và kiểm tra role/owner: cart, wishlist, order, stock/listing, RUL, admin, review, profile/settings, support. |
| [database.js](src/services/demo/database.js) | Tạo DB ban đầu từ data/mock; localStorage keys và hàm đọc JSON có fallback. Gắn owner cho fleet mẫu. |
| [queries.js](src/services/demo/queries.js) | Read models demo: join supplier/product, lọc cart/orders/fleet/analyses theo user, kiểm tra quyền khi truy cập order/history/recommendations trực tiếp. |

### `src/utils/`

| File | Mục đích |
| --- | --- |
| [date.js](src/utils/date.js) | Format ngày và giá trị ngày chưa có. |
| [money.js](src/utils/money.js) | Format tiền và giá chưa có offer. |
| [orderStages.js](src/utils/orderStages.js) | Danh sách thứ tự trạng thái đơn dùng cho filter/timeline. |

## File gốc, cấu hình và kiểm thử

| File | Mục đích |
| --- | --- |
| `index.html` | HTML entry, root và metadata; Vite nạp main.jsx. |
| `package.json` | Dependency và scripts dev/build/preview/test. |
| `package-lock.json` | Khóa dependency tree; dùng npm ci để cài lặp lại đúng phiên bản. |
| `vite.config.js` | React plugin và dev proxy API; target lấy từ environment. |
| `tailwind.config.js` | Đường dẫn quét class, palette và font theme. |
| `postcss.config.js` | Tailwind và Autoprefixer pipeline. |
| `.env.example` | Mẫu chọn demo/API và API URL/proxy; không chứa secret. |
| `.env.api-test` | API mode cho Playwright contract fixtures. |
| `.gitignore` | Loại node_modules/dist/env local và test output khỏi Git. |
| `playwright.config.js` | Demo E2E: Chromium, viewport, Vite port 5173 và test discovery. |
| `playwright.api.config.js` | API contract E2E: Vite mode api-test port 5174 và output riêng. |
| `tests/demo.spec.js` | Checkout/fulfilment, RUL, search/wishlist, listing/stock, admin, missing records và responsive tất cả nhóm route. |
| `tests/accounts.spec.js` | Sai credentials, suspended account, đăng ký/trùng email/hash, dữ liệu riêng giữa account, supplier mới rỗng, sidebar/contrast, required labels và public mobile. |
| `tests/api/http.spec.js` | Fixture HTTP kiểm tra adapter/auth/401/offers/cart/order/upload/RUL/supplier; không phải backend thật. |
| `README.md` | Cách cài/chạy, demo credentials, dữ liệu/auth, cấu trúc tổng quát và giới hạn tích hợp. |
| `API_INTEGRATION.md` | Contract, cấu hình proxy/API và các endpoint còn chờ backend. |
| `DESIGN_IMPLEMENTATION.md` | Mapping nhóm thiết kế sang file hiện tại và phạm vi hình ảnh/UI. |
| `CHAT_CONTEXT.md` | Ghi chú bàn giao, các quyết định và quy tắc không tự commit/push; không phải bản xuất chat đầy đủ. |
| `FILE_STRUCTURE.md` | Tài liệu từng file bạn đang đọc. |
| `VALIDATION.md` | Kết quả kiểm thử bản sửa cuối cùng và phạm vi đã xác minh. |
| `dist/index.html`, `dist/assets/*` | Output từ npm run build; JS/CSS/font đã bundle. Không sửa tay; sửa src rồi build lại. |
| `ZIP_MANIFEST.sha256` | Hash SHA-256 từng file source/docs/tests/build trong gói ZIP, tạo lúc bàn giao. |

## Khi cần sửa gì, vào đâu?

- **Thêm dữ liệu mẫu công khai:** `data/mock/catalog.js`; reset key DB v4 nếu muốn nạp lại seed. Thay seed không ghi đè DB đang lưu của người dùng.
- **Đổi mock fleet/order:** `data/mock/fleet.js`, `orders.js` và owner mapping trong `services/demo/database.js`.
- **Sửa login/signup:** page public + `services/demo/auth.js`/`AppProvider.jsx`; server mode nằm trong `services/api.js`.
- **Đổi quyền và lọc dữ liệu:** `services/demo/commands.js`/`queries.js`; production phải làm tương ứng ở backend.
- **Thêm menu/route:** `app/navigation.js` + `App.jsx` + page tương ứng.
- **Đổi header/sidebar:** `components/common/Header.jsx`/`Sidebar.jsx` + `layouts/WorkspaceLayout.jsx` + `index.css`.
- **Dấu bắt buộc:** đặt `required` trên input/select/textarea hoặc Field; Field gắn sao, Form gắn legend. Required checkbox ngoài Field phải gắn sao trong label như Register/Checkout.
- **Đổi API URL:** `.env.local` tạo từ `.env.example`, sau đó restart dev server. Không đặt password/token vào biến `VITE_*`.

Demo persistence chỉ nằm ở trình duyệt và origin hiện tại; không đồng bộ nhiều máy, không phải cơ chế bảo mật server. ZIP không chứa dữ liệu localStorage đã đăng ký trên máy bạn.
