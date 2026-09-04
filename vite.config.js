import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages phục vụ project site tại username.github.io/<repo>/ — cần
  // base khớp đúng tên repo, nếu không toàn bộ đường dẫn ảnh/audio (đều bắt
  // đầu bằng "/assets/...") sẽ 404. Đổi "numeria-demo" nếu bạn đặt tên repo
  // khác trên GitHub.
  base: '/numeria-demo/',
})
