const fs = require("fs");
const path = require("path");
const { optimize } = require("svgo");
const replaceColorsWithVars = require("./svgo-plugins/replace-colors-with-vars");

const inputDir = path.join(__dirname, "..", "svg");
const outputDir = path.join(__dirname, "..", "dist", "svg");

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read and process all SVG files
const files = fs.readdirSync(inputDir).filter((file) => file.endsWith(".svg"));

files.forEach((file) => {
  const filePath = path.join(inputDir, file);
  const content = fs.readFileSync(filePath, "utf-8");

  const result = optimize(content, {
    path: filePath,
    plugins: [replaceColorsWithVars],
  });

  fs.writeFileSync(path.join(outputDir, file), result.data);
  console.log(`Processed ${file}`);
});

console.log(`Done! Processed ${files.length} files.`);