import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path" 

export default defineConfig({
  plugins: [vue()],
  root: ".",                            
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,                  
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  compilerOptions: {
    baseUrl: __dirname,
    paths: {
      "@/*": ["src/*"]
    }
  }
})