// vite.config.ts
import { defineConfig } from "file:///Users/minhha/Desktop/CS3733/team-c/.yarn/__virtual__/vite-virtual-631674d411/0/cache/vite-npm-6.2.3-3b400d2412-ba6ad7e83e.zip/node_modules/vite/dist/node/index.js";
import react from "file:///Users/minhha/Desktop/CS3733/team-c/.yarn/__virtual__/@vitejs-plugin-react-swc-virtual-3e8bccf326/0/cache/@vitejs-plugin-react-swc-npm-3.8.1-68d4bcd3e1-ef431a4132.zip/node_modules/@vitejs/plugin-react-swc/index.mjs";
import eslint from "file:///Users/minhha/Desktop/CS3733/team-c/.yarn/__virtual__/vite-plugin-eslint-virtual-1f4e08d8c3/0/cache/vite-plugin-eslint-npm-1.8.1-844ad445f5-123c3dcf82.zip/node_modules/vite-plugin-eslint/dist/index.mjs";
import tailwindcss from "file:///Users/minhha/Desktop/CS3733/team-c/.yarn/__virtual__/@tailwindcss-vite-virtual-3619a7e21f/0/cache/@tailwindcss-vite-npm-4.0.17-074c9bb3f2-9baaa79b9c.zip/node_modules/@tailwindcss/vite/dist/index.mjs";
import * as process from "process";
import path from "path";
var __vite_injected_original_dirname = "/Users/minhha/Desktop/CS3733/team-c/apps/frontend";
var vite_config_default = defineConfig({
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  server: {
    host: "localhost",
    port: parseInt(process.env.FRONTEND_PORT),
    proxy: {
      "/api": process.env.BACKEND_URL
    },
    watch: {
      usePolling: true
    }
  },
  build: {
    outDir: "build"
  },
  cacheDir: ".vite",
  plugins: [
    tailwindcss(),
    react(),
    eslint({
      exclude: ["**/node_modules/**", "**/.*/**", "**/.vite/**"],
      failOnWarning: false,
      failOnError: false
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlUm9vdCI6ICIvVXNlcnMvbWluaGhhL0Rlc2t0b3AvQ1MzNzMzL3RlYW0tYy9hcHBzL2Zyb250ZW5kLyIsCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL21pbmhoYS9EZXNrdG9wL0NTMzczMy90ZWFtLWMvYXBwcy9mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL21pbmhoYS9EZXNrdG9wL0NTMzczMy90ZWFtLWMvYXBwcy9mcm9udGVuZC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbWluaGhhL0Rlc2t0b3AvQ1MzNzMzL3RlYW0tYy9hcHBzL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJztcbmltcG9ydCBlc2xpbnQgZnJvbSAndml0ZS1wbHVnaW4tZXNsaW50JztcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSc7XG5pbXBvcnQgKiBhcyBwcm9jZXNzIGZyb20gJ3Byb2Nlc3MnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIHJlc29sdmU6IHtcbiAgICAgICAgcHJlc2VydmVTeW1saW5rczogdHJ1ZSxcbiAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgICBwb3J0OiBwYXJzZUludChwcm9jZXNzLmVudi5GUk9OVEVORF9QT1JUKSxcbiAgICAgICAgcHJveHk6IHtcbiAgICAgICAgICAgICcvYXBpJzogcHJvY2Vzcy5lbnYuQkFDS0VORF9VUkwsXG4gICAgICAgIH0sXG4gICAgICAgIHdhdGNoOiB7XG4gICAgICAgICAgICB1c2VQb2xsaW5nOiB0cnVlLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgICAgb3V0RGlyOiAnYnVpbGQnLFxuICAgIH0sXG4gICAgY2FjaGVEaXI6ICcudml0ZScsXG4gICAgcGx1Z2luczogW1xuICAgICAgICB0YWlsd2luZGNzcygpLFxuICAgICAgICByZWFjdCgpLFxuICAgICAgICBlc2xpbnQoe1xuICAgICAgICAgICAgZXhjbHVkZTogWycqKi9ub2RlX21vZHVsZXMvKionLCAnKiovLiovKionLCAnKiovLnZpdGUvKionXSxcbiAgICAgICAgICAgIGZhaWxPbldhcm5pbmc6IGZhbHNlLFxuICAgICAgICAgICAgZmFpbE9uRXJyb3I6IGZhbHNlLFxuICAgICAgICB9KSxcbiAgICBdLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFVLFNBQVMsb0JBQW9CO0FBQ2xXLE9BQU8sV0FBVztBQUNsQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxpQkFBaUI7QUFDeEIsWUFBWSxhQUFhO0FBQ3pCLE9BQU8sVUFBVTtBQUxqQixJQUFNLG1DQUFtQztBQVF6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTO0FBQUEsSUFDTCxrQkFBa0I7QUFBQSxJQUNsQixPQUFPO0FBQUEsTUFDSCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDeEM7QUFBQSxFQUNKO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixNQUFNLFNBQWlCLFlBQUksYUFBYTtBQUFBLElBQ3hDLE9BQU87QUFBQSxNQUNILFFBQWdCLFlBQUk7QUFBQSxJQUN4QjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0gsWUFBWTtBQUFBLElBQ2hCO0FBQUEsRUFDSjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0gsUUFBUTtBQUFBLEVBQ1o7QUFBQSxFQUNBLFVBQVU7QUFBQSxFQUNWLFNBQVM7QUFBQSxJQUNMLFlBQVk7QUFBQSxJQUNaLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNILFNBQVMsQ0FBQyxzQkFBc0IsWUFBWSxhQUFhO0FBQUEsTUFDekQsZUFBZTtBQUFBLE1BQ2YsYUFBYTtBQUFBLElBQ2pCLENBQUM7QUFBQSxFQUNMO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
