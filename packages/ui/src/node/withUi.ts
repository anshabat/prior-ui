import path from "node:path";
import { fileURLToPath } from "node:url";
import { Config } from "tailwindcss";
import { defaultTheme } from "../theme";

// Compiled components live in dist (one level up from dist/node), resolved from the package itself
// so consumers don't depend on node_modules layout
const uiContent = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "**/*.js",
);

export function withUi(config: Config): Config {
  const { content } = config;

  return {
    ...config,
    presets: [defaultTheme, ...(config.presets ?? [])],
    content: Array.isArray(content)
      ? [...content, uiContent]
      : { ...content, files: [...content.files, uiContent] },
  };
}
