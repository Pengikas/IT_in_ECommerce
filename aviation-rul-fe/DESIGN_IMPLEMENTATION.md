# AeroRUL design implementation

Reference: bộ ZIP 29 frame PNG AeroRUL và hai tài liệu concept/UI structure do người dùng cung cấp. Các file chung tên `Html → Body-*` được nhận diện theo nội dung; không cần đổi tên hoặc chia folder lại. Figma chưa đọc trực tiếp được do proxy, nên không khẳng định pixel-perfect.

| Nhóm frame | Module triển khai |
| --- | --- |
| Login / Corporate Register | Public.jsx, auth shell và company form |
| Buyer Dashboard / Main | Fleet.jsx, KPI/alert/fleet table/recent orders |
| Header / Aside / App Shell | Shell.jsx, role navigation/mobile drawer |
| My Engines / RUL Analysis | Fleet.jsx, registry/search/filter/upload/history/results |
| Marketplace / product detail / image 23 | Public.jsx, Catalog.jsx, filters/tabs/offers |
| Cart / drawer / checkout frames | Commerce.jsx, Shell.jsx, quantities/address/delivery/payment/review |
| Order confirmation / order tracking | Commerce.jsx, shared Timeline |
| Replacement recommendations | Fleet.jsx, compatible cards/comparison table |
| Supplier Dashboard / Add Product | Supplier.jsx, catalog/inventory/fulfilment/insights |
| Admin Dashboard / moderation | Admin.jsx, verification/catalog/status actions |
| Sitemap / component kit / overview | App.jsx route groups và shared UI.jsx components |

Giữ navy #0B1F3A, nền sáng, accent xanh, font Inter và JetBrains Mono. KPI phản ánh dataset thực tế, không hardcode 24 engines hoặc doanh thu để khớp ảnh. Original photo/logo assets chưa được tách riêng, nên dùng SVG tạm; không đặt ảnh chụp toàn màn hình làm UI.

Desktop sidebar, tablet/mobile drawer; cards/grid xếp lại; bảng cuộn trong vùng riêng. Các màn hình bổ sung trong tài liệu dùng chung design system. Tests kiểm tra các route ở 390/768/1440 px, không thay thế visual review so với Figma.
