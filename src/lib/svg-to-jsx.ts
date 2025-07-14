// @ts-ignore - SVGO browser bundle doesn't have perfect types
import * as prettierPluginBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";
import * as prettierPluginTypescript from "prettier/plugins/typescript";
import * as prettier from "prettier/standalone";
import { optimize } from "svgo/browser";

export interface ConversionOptions {
  typescript: boolean;
  memo: boolean;
  passProps: boolean;
  minify: boolean;
  removeIds: boolean;
  // Import options
  omitImports: boolean;
  // New export style options
  exportStyle: "const" | "default" | "named";
  exportName?: string;
  // SVGO options
  optimizeSvg: boolean;
  svgoConfig?: Record<string, any>;
  // Prettier options
  useFormatter: boolean;
  prettierConfig?: {
    printWidth?: number;
    tabWidth?: number;
    useTabs?: boolean;
    semi?: boolean;
    singleQuote?: boolean;
    trailingComma?: "none" | "es5" | "all";
    bracketSpacing?: boolean;
    arrowParens?: "avoid" | "always";
  };
}

// HTML attributes that need to be converted to camelCase for JSX
const attributeMap: Record<string, string> = {
  "accent-height": "accentHeight",
  "alignment-baseline": "alignmentBaseline",
  "arabic-form": "arabicForm",
  "baseline-shift": "baselineShift",
  "cap-height": "capHeight",
  "clip-path": "clipPath",
  "clip-rule": "clipRule",
  "color-interpolation": "colorInterpolation",
  "color-interpolation-filters": "colorInterpolationFilters",
  "color-profile": "colorProfile",
  "color-rendering": "colorRendering",
  "dominant-baseline": "dominantBaseline",
  "enable-background": "enableBackground",
  "fill-opacity": "fillOpacity",
  "fill-rule": "fillRule",
  "flood-color": "floodColor",
  "flood-opacity": "floodOpacity",
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "font-size-adjust": "fontSizeAdjust",
  "font-stretch": "fontStretch",
  "font-style": "fontStyle",
  "font-variant": "fontVariant",
  "font-weight": "fontWeight",
  "glyph-name": "glyphName",
  "glyph-orientation-horizontal": "glyphOrientationHorizontal",
  "glyph-orientation-vertical": "glyphOrientationVertical",
  "horiz-adv-x": "horizAdvX",
  "horiz-origin-x": "horizOriginX",
  "image-rendering": "imageRendering",
  "letter-spacing": "letterSpacing",
  "lighting-color": "lightingColor",
  "marker-end": "markerEnd",
  "marker-mid": "markerMid",
  "marker-start": "markerStart",
  "overline-position": "overlinePosition",
  "overline-thickness": "overlineThickness",
  "paint-order": "paintOrder",
  "panose-1": "panose1",
  "pointer-events": "pointerEvents",
  "rendering-intent": "renderingIntent",
  "shape-rendering": "shapeRendering",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "strikethrough-position": "strikethroughPosition",
  "strikethrough-thickness": "strikethroughThickness",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-miterlimit": "strokeMiterlimit",
  "stroke-opacity": "strokeOpacity",
  "stroke-width": "strokeWidth",
  "text-anchor": "textAnchor",
  "text-decoration": "textDecoration",
  "text-rendering": "textRendering",
  "underline-position": "underlinePosition",
  "underline-thickness": "underlineThickness",
  "unicode-bidi": "unicodeBidi",
  "unicode-range": "unicodeRange",
  "units-per-em": "unitsPerEm",
  "v-alphabetic": "vAlphabetic",
  "v-hanging": "vHanging",
  "v-ideographic": "vIdeographic",
  "v-mathematical": "vMathematical",
  "vector-effect": "vectorEffect",
  "vert-adv-y": "vertAdvY",
  "vert-origin-x": "vertOriginX",
  "vert-origin-y": "vertOriginY",
  "word-spacing": "wordSpacing",
  "writing-mode": "writingMode",
  "x-height": "xHeight",
};

// Convert HTML attribute to JSX attribute
function convertAttribute(
  name: string,
  value: string,
  options: ConversionOptions,
): string {
  const jsxName = attributeMap[name] || name;

  // Handle className specifically
  if (name === "class") {
    return `className="${value}"`;
  }

  return `${jsxName}="${value}"`;
}

// Default SVGO configuration for better optimization
const defaultSvgoConfig = {
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // Keep viewBox for responsive scaling
          removeViewBox: false,
          // Keep IDs if they're referenced
          cleanupIds: {
            preservePrefixes: ["icon-", "gradient-", "pattern-"],
          },
        },
      },
    },
    // Remove unnecessary elements
    "removeXMLNS",
    "removeDimensions",
    // Optimize paths
    "convertPathData",
    // Minify styles
    "minifyStyles",
    // Clean up attributes
    "removeUselessStrokeAndFill",
    "removeUnknownsAndDefaults",
  ],
};

// Apply SVGO optimization to SVG content
async function optimizeSvgContent(
  svgContent: string,
  options: ConversionOptions,
): Promise<string> {
  if (!options.optimizeSvg) {
    return svgContent;
  }

  try {
    const svgoConfig: any = {
      ...defaultSvgoConfig,
      ...options.svgoConfig,
    };

    const result = optimize(svgContent, svgoConfig);
    return typeof result === "string" ? result : result.data;
  } catch (error) {
    console.warn("SVGO optimization failed:", error);
    return svgContent;
  }
}

// Format code using Prettier
async function formatCodeWithPrettier(
  code: string,
  options: ConversionOptions,
): Promise<string> {
  if (!options.useFormatter || options.minify) {
    return code;
  }

  try {
    const prettierOptions: any = {
      parser: options.typescript ? "typescript" : "babel",
      plugins: options.typescript
        ? [prettierPluginTypescript, prettierPluginEstree]
        : [prettierPluginBabel, prettierPluginEstree],
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: false, // Default to double quotes, can be overridden by prettierConfig
      trailingComma: "es5" as const,
      bracketSpacing: true,
      arrowParens: "avoid" as const,
      ...options.prettierConfig,
    };

    const formatted = await prettier.format(code, prettierOptions);
    return formatted;
  } catch (error) {
    console.warn("Prettier formatting failed:", error);
    return code;
  }
}

// Generate the appropriate export statement
function generateExport(
  componentName: string,
  componentCode: string,
  options: ConversionOptions,
): string {
  const exportName = options.exportName || componentName;

  switch (options.exportStyle) {
    case "default":
      return `export default ${componentCode};`;
    case "named":
      // For named exports, we need to first define the component, then export it
      return `const ${componentName} = ${componentCode};\n\nexport { ${componentName} as ${exportName} };`;
    case "const":
    default:
      return `export const ${exportName} = ${componentCode};`;
  }
}

// Parse SVG and convert to JSX
export async function convertSvgToJsx(
  svgContent: string,
  componentName: string,
  options: ConversionOptions,
): Promise<string> {
  if (!svgContent.trim()) {
    return "";
  }

  try {
    // Step 1: Optimize SVG with SVGO if enabled
    let optimizedSvg = await optimizeSvgContent(svgContent, options);

    // Step 2: Basic SVG to JSX conversion
    let jsxContent = optimizedSvg;

    // Convert HTML comments to JSX comments
    jsxContent = jsxContent.replace(/<!--([\s\S]*?)-->/g, "{/* $1 */}");

    // Remove IDs if requested (and not already handled by SVGO)
    if (options.removeIds && !options.optimizeSvg) {
      jsxContent = jsxContent.replace(/\s+id\s*=\s*["'][^"']*["']/g, "");
    }

    // Convert self-closing tags that aren't properly closed
    jsxContent = jsxContent.replace(
      /<(\w+)([^>]*?)(?<!\/)\s*>/g,
      (match, tagName, attributes) => {
        if (isVoidElement(tagName)) {
          return `<${tagName}${attributes} />`;
        }
        return match;
      },
    );

    // Convert attributes
    jsxContent = jsxContent.replace(
      /(\w[\w-]*)\s*=\s*(["'])(.*?)\2/g,
      (match, name, quote, value) => {
        return convertAttribute(name, value, options);
      },
    );

    // Step 3: Build the component
    const imports = [];

    if (!options.omitImports) {
      if (options.typescript) {
        imports.push("import React from 'react';");
      }

      if (options.memo) {
        imports.push(
          options.typescript
            ? "import { memo } from 'react';"
            : "import { memo } from 'react';",
        );
      }
    }

    const propsType = options.typescript
      ? ": React.SVGProps<SVGSVGElement>"
      : "";
    const memoStart = options.memo ? "memo(" : "";
    const memoEnd = options.memo ? ")" : "";

    // Extract the SVG content and add props if needed
    const svgMatch = jsxContent.match(/<svg([^>]*)>([\s\S]*?)<\/svg>/);
    if (!svgMatch) {
      throw new Error("Invalid SVG content");
    }

    let [, svgAttributes, svgChildren] = svgMatch;

    // Add props spreading if enabled
    if (options.passProps) {
      svgAttributes = svgAttributes?.trim();
      if (svgAttributes && !svgAttributes.endsWith(" ")) {
        svgAttributes += " ";
      }
      svgAttributes += "{...props}";
    }

    // Build the component function
    const componentFunction = `${memoStart}(props${propsType}) => {
  return (
    <svg${svgAttributes ? ` ${svgAttributes}` : ""}>
${svgChildren}
    </svg>
  );
}${memoEnd}`;

    // Generate the export
    const exportStatement = generateExport(
      componentName,
      componentFunction,
      options,
    );

    // Combine everything
    let finalCode =
      imports.length > 0
        ? `${imports.join("\n")}\n\n${exportStatement}`
        : exportStatement;

    // Step 4: Apply formatting
    if (options.useFormatter && !options.minify) {
      finalCode = await formatCodeWithPrettier(finalCode, options);
    } else if (!options.useFormatter && !options.minify) {
      finalCode = formatCode(finalCode, options);
    } else if (options.minify) {
      finalCode = minifyCode(finalCode);
    }

    return finalCode;
  } catch (error) {
    return `// Error converting SVG: ${error instanceof Error ? error.message : "Unknown error"}
// Please check your SVG syntax and try again.`;
  }
}

// Helper function to check if an element is void (self-closing)
function isVoidElement(tagName: string): boolean {
  const voidElements = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
    // SVG void elements
    "circle",
    "ellipse",
    "line",
    "path",
    "polygon",
    "polyline",
    "rect",
    "stop",
    "use",
  ];
  return voidElements.includes(tagName.toLowerCase());
}

// Enhanced formatting function
export function formatCode(code: string, options: ConversionOptions): string {
  if (options.minify) {
    return minifyCode(code);
  }

  let formatted = code;

  // Normalize line endings and clean up
  formatted = formatted.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Split into lines for processing
  const lines = formatted.split("\n");
  const formattedLines: string[] = [];
  let indentLevel = 0;
  const indentSize = 2;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      formattedLines.push("");
      continue;
    }

    // Decrease indent for closing tags and brackets
    if (
      trimmedLine.startsWith("</") ||
      trimmedLine.startsWith("})") ||
      trimmedLine === "}" ||
      trimmedLine === "});"
    ) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Add the line with proper indentation
    const indent = " ".repeat(indentLevel * indentSize);
    formattedLines.push(indent + trimmedLine);

    // Increase indent for opening tags and brackets
    if (
      (trimmedLine.includes("<") &&
        !trimmedLine.includes("</") &&
        !trimmedLine.endsWith("/>")) ||
      trimmedLine.endsWith("{") ||
      trimmedLine.endsWith("=> {")
    ) {
      indentLevel++;
    }
  }

  return formattedLines.join("\n");
}

// Minify code function
function minifyCode(code: string): string {
  return code
    .replace(/\n\s*/g, " ")
    .replace(/\s+/g, " ")
    .replace(/;\s*}/g, "}")
    .replace(/\s*{\s*/g, "{")
    .replace(/\s*}\s*/g, "}")
    .replace(/\s*=\s*/g, "=")
    .replace(/\s*,\s*/g, ",")
    .trim();
}
