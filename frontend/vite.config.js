import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { merge } from "lodash-es";

const baseConfig = defineConfig({
  plugins: [react()],
});

const linkConfig = defineConfig({
  server: {
    watch: {
      ignored: [`!**/node_modules/@charming-art/charming/**`],
    },
  },
  optimizeDeps: {
    exclude: [`@charming-art/charming/`],
  },
});

// https://vitejs.dev/config/
export default defineConfig(() => (process.env.LINK ? merge(baseConfig, linkConfig) : baseConfig));
