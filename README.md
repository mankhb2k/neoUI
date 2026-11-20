# Neonix UI

Trang chủ tổng hợp hai thư viện cho Next.js App Router. **Premium** dùng chủ đề Obsidian và là giao diện mặc định của website. **Minimal** dùng tông sáng đơn sắc. Mỗi thư viện có trang riêng cho Button, Card và Input. Tab **Code** hiển thị file TSX và CSS Module dùng trong bản xem trước.

Cả hai thư viện đều có token sáng và tối. Nút mặt trời/trăng ở header đổi giao diện và lưu lựa chọn bằng Zustand.

## Chạy thư viện

```bash
npm install
npm run dev
```

Mặc định, mở `http://localhost:3000`.

## Dùng trong một dự án Next.js khác

Sao chép hai file của component vào cùng một thư mục. Thêm CSS ở trang **Design tokens** vào `app/globals.css`, rồi đặt `data-neo-style="minimal"` và `data-theme="light"` hoặc `data-theme="dark"` trên `<html>` hay vùng giao diện. Dùng `data-neo-style="obsidian"` cho Premium.

Bạn cũng có thể gọi CLI từ thư mục gốc của dự án đích. Thay `<neonix-ui>` bằng đường dẫn tới bản Neonix UI trên máy.

```bash
node "<neonix-ui>/scripts/ui.mjs" list
node "<neonix-ui>/scripts/ui.mjs" add button --style minimal --path components/ui/minimal
node "<neonix-ui>/scripts/ui.mjs" tokens --style minimal
```

Lệnh cuối tạo `app/neonix-minimal.css`. Import `./neonix-minimal.css` trong `app/layout.tsx`. Nếu dự án dùng `src/app`, thêm `--path src/app` vào lệnh `tokens`. CLI dùng Premium (`obsidian`) nếu bỏ qua `--style`.

Khi dùng hai style cùng lúc, đặt component của mỗi style ở thư mục riêng, import cả hai file token, rồi bọc từng vùng bằng `data-neo-style="obsidian"` hoặc `data-neo-style="minimal"`.

## Thêm style vào thư viện

Tạo thư mục trong `registry/styles/` chứa `globals.css`, các file TSX và CSS Module tương ứng. Khai báo style trong `registry/catalog.json`, import token trong `app/layout.tsx` và đăng ký các component trong `src/catalog-previews.ts`.
