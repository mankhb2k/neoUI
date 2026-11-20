# Neonix UI

Trang chủ tổng hợp hai thư viện cho Next.js App Router. **Obsidian** là giao diện mặc định của website. **Minimal** dùng tông sáng đơn sắc. Mỗi thư viện có trang riêng cho Button, Card và Input. Tab **Code** hiển thị file TSX và CSS Module dùng trong bản xem trước.

Cả hai thư viện đều có token sáng và tối. Nút mặt trời/trăng ở header đổi giao diện và lưu lựa chọn bằng Zustand.

## Chạy thư viện

```bash
npm install
npm run dev
```

Mặc định, mở `http://localhost:3000`.

## Cài theme vào dự án Next.js

Chạy các lệnh này từ thư mục gốc của dự án Next.js:

```bash
npx --yes --package=github:mankhb2k/neoUI neonix init --style obsidian --mode dark
npx --yes --package=github:mankhb2k/neoUI neonix add button
npx --yes --package=github:mankhb2k/neoUI neonix add card
```

`init` tạo `components/ui`, lưu style và chế độ vào `neonix.json`, rồi thay nội dung `app/globals.css` bằng token light/dark của theme. Nếu dự án dùng `src/app`, CLI tự chọn `src/app/globals.css`. Có thể chọn Minimal bằng `--style minimal` và light mặc định bằng `--mode light`.

Lệnh `add` chép source TSX gốc và CSS Module của component đã chọn vào `components/ui`. Chạy `npx --yes --package=github:mankhb2k/neoUI neonix add --all` để chép tất cả component. CLI dùng theme trong `neonix.json`, hoặc Obsidian nếu chưa khởi tạo.

**Lưu ý:** `init` ghi đè có chủ đích file `globals.css` đã có trong thư mục app. Hãy giữ lại các style tùy chỉnh cần thiết trước khi chạy lệnh. Vì Next.js đã import `globals.css` trong `app/layout.tsx`, không cần sửa layout.

## Thêm style vào thư viện

Tạo thư mục trong `registry/styles/` chứa `globals.css`, các file TSX và CSS Module tương ứng. Khai báo style trong `registry/catalog.json`, import token trong `app/layout.tsx` và đăng ký các component trong `src/catalog-previews.ts`.
