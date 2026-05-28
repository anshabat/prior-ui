import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // ONLY point to the main entry file now
  format: ["cjs", "esm"], // Output both CommonJS and ES Modules
  dts: true, // Generate TypeScript declaration files
  clean: true, // Wipe the dist folder before building
});
