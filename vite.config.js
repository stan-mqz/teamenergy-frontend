import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                section6: resolve(__dirname, "section6.html"),
                stats: resolve(__dirname, "stats.html"),
                section2: resolve(__dirname, "section2.html"),
                
            },
        },
    },
});