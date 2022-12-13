/// <reference types="vitest" />

import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const alias = {
    "@": path.resolve(__dirname, "src")
};

export default defineConfig({
    build: {
        lib: {
            name: "synth-color",
            entry: "src/index.ts",
            fileName: "index"
        },
        outDir: "dist"
    },
    plugins: [dts()],
    resolve: {
        alias
    },
    test: {
        globals: true
    }
});
