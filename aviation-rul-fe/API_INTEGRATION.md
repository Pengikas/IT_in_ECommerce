# AeroRUL REST API integration

## Trạng thái và nguồn hợp đồng

Adapter dựa trên [API design của main](https://github.com/Pengikas/IT_in_ECommerce/blob/main/docs/api/README.md), commit `1d888451cdb66197687f7aafd69bb1f011a16cd5`. Main hiện có tài liệu/pipeline/schema, chưa có mã server chạy được; branch Backend đã kiểm tra chỉ có README. Chưa thể xác nhận live integration. Không có mã backend được copy vào frontend.

## Cấu hình

Copy `.env.example` thành `.env.local` rồi chỉnh:

```dotenv
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=/api/v1
API_PROXY_TARGET=http://127.0.0.1:3000
```

Port 3000 chỉ là ví dụ; dùng địa chỉ backend thật. Khởi động lại `npm run dev` sau khi thay biến. Frontend gọi `/api/v1`; Vite proxy chuyển tiếp tới server trong development. Production cần reverse proxy `/api` hoặc HTTPS base URL + CORS phù hợp ở backend. Không có secret nào được đặt trong VITE_* vì các giá trị này được đưa vào bundle công khai.

Giữ `VITE_DATA_SOURCE=demo` để xem UI không cần server. Các lỗi mạng/API trong mode `api` được hiển thị, không fallback sang mock. Auth, cart và orders API không dùng demo localStorage. API wishlist là shortlist cục bộ riêng.

## Endpoint

Tất cả có prefix `/api/v1`.

| Tác vụ | Endpoint | Nguồn |
| --- | --- | --- |
| Auth | POST `/auth/login`, POST `/auth/register`, GET `/auth/me` | main API design |
| Logout | POST `/auth/logout` | cần bổ sung contract |
| Catalog | GET `/products`, GET `/products/:id`, GET `/products/:id/listings` | main API design |
| Categories/suppliers | GET `/categories`, GET `/suppliers` | cần bổ sung contract |
| Server cart | GET `/cart`, POST `/cart/items`, PATCH/DELETE `/cart/items/:id` | main API design |
| Orders | GET/POST `/orders`, GET `/orders/:id` | route đã mô tả; checkout body cần thống nhất |
| Fleet | GET `/aircraft`, GET `/aircraft/:id/engines`, GET `/engines/:id` | main API design |
| RUL | GET `/engines/:id/rul-predictions/latest`, POST `/engines/:id/rul-predictions`, GET `/engines/:id/recommendations` | main API design |
| Sensor upload | POST `/engines/:id/sensor-uploads` | đề xuất, cần backend xác nhận |
| Supplier listings | GET/POST `/supplier/listings`, PATCH `/supplier/listings/:id` | main API design |
| Supplier orders | GET `/supplier/orders`, PATCH `/supplier/orders/:id` | đề xuất, cần backend xác nhận |

Admin/profile/settings/notifications/reviews/analytics chưa có remote contract nên được chặn bằng thông báo integration pending trong API mode; demo mode vẫn có các màn hình đó.

## Response / models

Response thành công `{success:true,data:...}`; lỗi `{success:false,error:{message,code}}` kèm HTTP status thích hợp. Collection dùng `data.items` hoặc array. Các field dưới đây là phần contract UI cần backend cung cấp/xác nhận, không phải assertion rằng server đã tồn tại:

- User: `id,name,companyName,email,role` với role `buyer|supplier|admin`.
- Product: `productId,productName,partNumber,compatibility` (array engine-model strings), và các thông tin category/spec nếu có.
- Listing: `listingId,productId,price,stockQuantity,condition,deliveryDays,status,supplierId,supplier`. Supplier object gồm `name,verified,region,rating`; supplier-listing records có `product` object.
- Engine: `engineId,engineModel,currentCycle,latestRul,urgency,lastAnalysis`.
- Cart item: `cartItemId,quantity,product,listing`.
- Order: `id,status,placedAt,total,shipping,shippingInfo,items`; item có `productId,listingId/orderItemId,product,quantity,price`.

Adapter đổi `productId/productName` thành `id/name`, `engineId/engineModel` thành `id/model`. Giá/tồn kho gắn với listing. Nếu catalog không có offer summary, client gọi `/products/:id/listings` để chọn listing còn hàng giá thấp nhất; product detail cho chọn seller offer khác. Nên bổ sung offer summaries vào catalog để tránh N+1 request. Catalog hiện lấy tối đa 24 product; server pagination là bước tích hợp tiếp theo khi có server thật.

### Auth

Login gửi `{email,password}`, không gửi role do client chọn. Backend trả `{user,accessToken}`; JWT trong Authorization Bearer và sessionStorage của tab, xóa khi 401/đăng xuất. Password không lưu. Cookie credentials và optional csrfToken/X-CSRF-Token cũng được hỗ trợ. Refresh-token flow chưa có trong tài liệu. Role guard frontend chỉ điều hướng; server phải phân quyền cho mọi request.

### Cart và checkout

Add-to-cart gửi `{listingId,quantity}`; quantity/remove cập nhật đúng cartItemId. Supplier tạo seller listing cho catalog product có sẵn bằng productId, không giả định endpoint listing tạo catalog product mới.

Checkout body đề xuất:

```json
{
  "items": [{"listingId": 501, "quantity": 1}],
  "shippingInfo": {
    "companyName": "Buyer company",
    "taxId": "DEMO-TAX",
    "purchaseRef": "PO-001",
    "address": "Shipping address",
    "deliveryMethod": "Standard freight",
    "paymentMethod": "Invoice · Net 30 (simulation)"
  }
}
```

Client không gửi giá/tổng tiền như một nguồn tin cậy. Server cần revalidate stock/price/cart/ownership, tạo parent/seller orders, trừ stock và xóa cart trong transaction; response trả final order totals. Shipping trong UI trước đặt hàng chỉ là ước lượng. Frontend chưa có payment gateway.

### RUL

CSV gửi multipart field `file`; upload trả `sensorUploadId` (hoặc `id`). Sau đó POST prediction với `{sensorUploadId}`. Backend chịu trách nhiệm schema/preprocess/model inference. Frontend không dựng RUL mẫu khi API lỗi.

Main mới mô tả latest prediction nên API chart hiện chỉ vẽ một điểm latest; không tự giả định history endpoint. Recommendation response hỗ trợ `recommendedParts` trong tài liệu; các product/offer tương ứng được lấy từ catalog. Demo ranking không thay thế ranking server.

## Xác minh

`npm run test:api` khởi động Vite mode `api-test` ở port 5174. Playwright chặn các HTTP request và trả fixtures để kiểm tra JWT/401, mapping product/listing, no-mock-fallback, server cart/order, multipart RUL và supplier actions. Đây là kiểm thử contract frontend, không phải kiểm thử backend/database/model thật.

Muốn xác minh end-to-end cần mã server hoặc API URL đang chạy, response contract thực tế, database/migrations, account test và RUL endpoint. Chưa có các thành phần đó trong remote đã kiểm tra.
