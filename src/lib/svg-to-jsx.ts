export interface ConversionOptions {
  typescript: boolean;
  memo: boolean;
  quotes: "single" | "double";
  passProps: boolean;
  minify: boolean;
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
  const quote = options.quotes === "single" ? "'" : '"';

  // Handle className specifically
  if (name === "class") {
    return `className=${quote}${value}${quote}`;
  }

  return `${jsxName}=${quote}${value}${quote}`;
}

// Parse SVG and convert to JSX
export function convertSvgToJsx(
  svgContent: string,
  componentName: string,
  options: ConversionOptions,
): string {
  if (!svgContent.trim()) {
    return "";
  }

  try {
    // Basic SVG to JSX conversion
    let jsxContent = svgContent;

    // Convert HTML comments to JSX comments
    jsxContent = jsxContent.replace(/<!--([\s\S]*?)-->/g, "{/* $1 */}");

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
      /(\w[\w-]*)\s*=\s*"([^"]*)"/g,
      (match, name, value) => {
        return convertAttribute(name, value, options);
      },
    );

    jsxContent = jsxContent.replace(
      /(\w[\w-]*)\s*=\s*'([^']*)'/g,
      (match, name, value) => {
        return convertAttribute(name, value, options);
      },
    );

    // Build the component
    const quote = options.quotes === "single" ? "'" : '"';
    const imports = [];

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
      svgAttributes = svgAttributes.trim();
      if (svgAttributes && !svgAttributes.endsWith(" ")) {
        svgAttributes += " ";
      }
      svgAttributes += "{...props}";
    }

    // Build the final component
    let component = `export const ${componentName} = ${memoStart}(props${propsType}) => {
  return (
    <svg${svgAttributes ? ` ${svgAttributes}` : ""}>
${svgChildren}
    </svg>
  );
}${memoEnd};`;

    // Add imports
    const finalCode =
      imports.length > 0 ? `${imports.join("\n")}\n\n${component}` : component;

    // Minify if requested
    if (options.minify) {
      return finalCode
        .replace(/\n\s*/g, " ")
        .replace(/\s+/g, " ")
        .replace(/;\s*}/g, "}")
        .trim();
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

// Prettier formatting function (basic implementation)
export function formatCode(code: string, options: ConversionOptions): string {
  if (options.minify) {
    return code;
  }

  // Basic formatting - in a real implementation, you might want to use prettier
  let formatted = code;

  // Add proper indentation
  formatted = formatted.replace(/^/gm, "  ");
  formatted = formatted.replace(/^  (import|export)/gm, "$1");

  return formatted;
}
