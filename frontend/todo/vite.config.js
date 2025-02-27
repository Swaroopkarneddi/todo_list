import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/todos": "https://todo-list-mk9g.onrender.com",
    },
  },
});
