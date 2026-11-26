// A custom PostCSS config replaces Next's default one,
// so autoprefixer must be listed again
const config = {
  plugins: {
    tailwindcss: {}, // run Tailwind with default options (reads tailwind.config.ts)
    autoprefixer: {}, // run Autoprefixer with default options (reads browserslist)
  },
};

export default config;
