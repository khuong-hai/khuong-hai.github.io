import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Repo là "user page" (khuong-hai.github.io) nên site chạy ở domain gốc,
  // không cần base — mọi đường dẫn "/assets/..." hardcode trong code (ảnh,
  // nhạc, video) khớp thẳng với domain gốc, không bị lệch subpath.
})
