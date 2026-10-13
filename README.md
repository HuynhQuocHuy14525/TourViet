# Tour Việt – Bài giữa kỳ Lập trình thiết bị di động

## Cấu trúc
```
App.tsx                      Câu 1, 2, 4c, 5, 6 (màn hình chính)
components/TourItem.tsx      Câu 3, 4a, 4b (kiểu Tour, TourItemProps, React.memo)
utils/tour.ts                groupByCity, formatDate, getSeatLabel, formatPrice
__tests__/tour.test.ts       Câu 7a, 7b
__tests__/TourItem.test.tsx  Câu 7c, 7d
tours.json                   13 bản ghi mẫu để dán vào mockapi.io
```

## Bước 1 – Tạo API trên mockapi.io
1. Đăng nhập https://mockapi.io → New Project.
2. New resource tên `tours`, schema:
   name (String), city (String), days (Number), price (Number), seats (Number),
   departure (String), image (String), isFavorite (Boolean).
3. Mở tab **Data** của resource, dán toàn bộ nội dung `tours.json` → Update.
   (Bản ghi 1 đã có tên SV; sửa lại nếu cần.)
4. Copy endpoint, ví dụ `https://6712abcd.mockapi.io/tours`.

Dữ liệu mẫu thoả đề: 13 bản ghi, 5 thành phố; seats = 0: id 2, 6;
seats 1–3: id 3, 5, 8; isFavorite = true: id 1, 5.

## Bước 2 – Sửa 2 hằng số trong App.tsx
```ts
const API_URL = 'https://<your-project-id>.mockapi.io/tours';
const STUDENT = '21xxxxxx – Nguyễn Trọng Tiến';
```

## Bước 3 – Chạy
- **Snack**: tạo đúng các file/thư mục như trên (App.tsx, components/TourItem.tsx,
  utils/tour.ts, __tests__/...), thêm dependency `react-native-safe-area-context`.
- **VSCode**: `npm install` → `npx expo start`.
- Test: `npm test` (11 test, đều pass).
