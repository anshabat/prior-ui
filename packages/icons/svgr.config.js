module.exports = {
  typescript: true,
  ext: "tsx",
  outDir: "generated",
  template,
  jsxRuntime: "automatic",
  svgProps: {
    style: "{iconStyle}",
  },
};

function template(variables, { tpl }) {
  return tpl`
    ${variables.imports}

    interface IconProps extends React.SVGProps<SVGSVGElement> {
      color?: string;
      color2?: string;
      color3?: string;
      color4?: string;
    }

    function ${variables.componentName}(allProps: IconProps) {
      const { color, color2, color3, color4, style, ...props } = allProps;

      const iconStyle = {
        ...(color && { '--color-0': color }),
        ...(color2 && { '--color-1': color2 }),
        ...(color3 && { '--color-2': color3 }),
        ...(color4 && { '--color-3': color4 }),
        ...style,
      };

      return ${variables.jsx};
    }

    ${variables.exports}
  `;
}
