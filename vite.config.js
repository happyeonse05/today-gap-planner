import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/today-gap-planner/",
  plugins: [react()],
});
