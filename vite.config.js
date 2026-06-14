import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                section6: resolve(__dirname, "section6.html"),
                section3: resolve(__dirname, "section3.html"),
                section5: resolve(__dirname, 'section5.html'),
                stats: resolve(__dirname, "stats.html"),
                section2: resolve(__dirname, "section2.html"),
                
            },
        },
    },
});