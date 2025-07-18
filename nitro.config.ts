import { join } from "path";
import pkg from "./package.json";

//https://nitro.unjs.io/config
export default defineNitroConfig({
  compatibilityDate: "2025-04-20",
  srcDir: "./src",
  preset: 'netlify',
  runtimeConfig: {
    version: pkg.version
  },
  alias: {
    "@": join(__dirname, "src")
  },
  experimental: {
    wasm: false
  },
  rollupConfig: {
    external: ['es5-ext'],
    plugins: [
      {
        name: 'exclude-problematic-files',
        generateBundle(options, bundle) {
          // Remove any files with # or ? in the name
          Object.keys(bundle).forEach(fileName => {
            if (fileName.includes('#') || fileName.includes('?')) {
              delete bundle[fileName];
            }
          });
        }
      }
    ]
  }
});
