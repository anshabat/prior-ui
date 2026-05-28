/**
 * SVGO plugin that replaces color values with CSS custom properties
 * Generates variables like --color-0, --color-1, etc. with original colors as fallbacks
 */
module.exports = {
  name: "replaceColorsWithVars",
  fn: () => {
    const colorMap = new Map();
    let colorIndex = 0;

    return {
      element: {
        enter: (node) => {
          ["fill", "stroke"].forEach((attr) => {
            if (node.attributes[attr]) {
              const value = node.attributes[attr];
              // Skip 'none' and existing CSS variables
              if (value === "none" || value.startsWith("var(")) {
                return;
              }

              // Check if this is a color value
              if (
                value.match(/^(#|rgb|rgba|hsl|hsla)/i) ||
                value.match(/^[a-z]+$/i)
              ) {
                if (!colorMap.has(value)) {
                  colorMap.set(value, colorIndex++);
                }
                const varName = `--color-${colorMap.get(value)}`;
                node.attributes[attr] = `var(${varName}, ${value})`;
              }
            }
          });
        },
      },
    };
  },
};