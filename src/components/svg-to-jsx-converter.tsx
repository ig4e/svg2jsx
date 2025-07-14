"use client";

import { Check, Code2, Copy, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { convertSvgToJsx, type ConversionOptions } from "~/lib/svg-to-jsx";
import { ConfigurationPanel } from "./configuration-panel";
import { Button } from "./ui/button";
import { CodeEditor } from "./ui/code-editor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

export function SvgToJsxConverter() {
  const [svgInput, setSvgInput] = useState("");
  const [jsxOutput, setJsxOutput] = useState("");
  const [componentName, setComponentName] = useState("MyIcon");
  const [isConverting, setIsConverting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [options, setOptions] = useState<ConversionOptions>({
    typescript: true,
    memo: true,
    passProps: true,
    minify: false,
    removeIds: false,
    // Import options
    omitImports: false,
    // New export style options
    exportStyle: "const",
    exportName: undefined,
    // SVGO options
    optimizeSvg: true,
    svgoConfig: undefined,
    // Prettier options
    useFormatter: true,
    prettierConfig: {
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: false,
      trailingComma: "es5",
      bracketSpacing: true,
      arrowParens: "avoid",
    },
  });

  const LOCALSTORAGE_KEY = "svg2jsx:options";

  // Load options from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCALSTORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setOptions((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      // Ignore errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save options to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(options));
    } catch (e) {
      // Ignore errors
    }
  }, [options]);

  // Convert SVG to JSX using the conversion utility
  const performConversion = async () => {
    if (!svgInput.trim()) {
      setJsxOutput("");
      return;
    }

    setIsConverting(true);
    try {
      const result = await convertSvgToJsx(svgInput, componentName, options);
      setJsxOutput(result);
    } catch (error) {
      console.error("Conversion failed:", error);
      setJsxOutput(`// Error converting SVG: ${error instanceof Error ? error.message : "Unknown error"}
// Please check your SVG syntax and try again.`);
    } finally {
      setIsConverting(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performConversion();
    }, 300); // Debounce conversion by 300ms

    return () => clearTimeout(timeoutId);
  }, [svgInput, componentName, options]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsxOutput);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const downloadFile = () => {
    const element = document.createElement("a");
    const file = new Blob([jsxOutput], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${componentName}.${options.typescript ? "tsx" : "jsx"}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  const outputLanguage = options.typescript ? "tsx" : "jsx";

  return (
    <div className="bg-background flex h-screen w-screen overflow-hidden">
      <div className="flex h-full max-w-full flex-1 flex-col">
        {/* Header */}
        <div className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
          <div className="flex items-center justify-between p-4">
            <div>
              <h1 className="text-xl font-bold">SVG to JSX Converter</h1>
              <p className="text-muted-foreground text-xs">
                Convert SVG code to React JSX components with SVGO optimization
                and Prettier formatting
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={copySuccess ? "default" : "outline"}
                size="sm"
                onClick={copyToClipboard}
                disabled={!jsxOutput || isConverting}
                className="transform transition-all duration-200 ease-in-out active:scale-95"
              >
                {copySuccess ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copySuccess ? "Copied!" : "Copy"}
              </Button>
              <Button
                variant={downloadSuccess ? "default" : "outline"}
                size="sm"
                onClick={downloadFile}
                disabled={!jsxOutput || isConverting}
                className="transform transition-all duration-200 ease-in-out active:scale-95"
              >
                {downloadSuccess ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {downloadSuccess ? "Downloaded!" : "Download"}
              </Button>
            </div>
          </div>

          {/* Configuration Panel */}
          <ConfigurationPanel
            componentName={componentName}
            setComponentName={setComponentName}
            options={options}
            setOptions={setOptions}
          />
        </div>

        {/* Editor Area with Resizable Panels */}
        <div className="min-h-0 flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            {/* Input Panel */}
            <ResizablePanel defaultSize={50} minSize={25} className="min-w-0">
              <div className="flex h-full flex-col">
                <div className="border-border bg-muted/50 border-b px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Code2 className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">SVG Input</span>
                    {options.optimizeSvg && (
                      <span className="text-muted-foreground text-xs">
                        (SVGO optimized)
                      </span>
                    )}
                  </div>
                </div>
                <div className="min-h-0 flex-1">
                  <CodeEditor
                    value={svgInput}
                    onChange={setSvgInput}
                    language="svg"
                    placeholder="Paste your SVG code here..."
                  />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Output Panel */}
            <ResizablePanel defaultSize={50} minSize={25} className="min-w-0">
              <div className="flex h-full flex-col">
                <div className="border-border bg-muted/50 border-b px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Code2 className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">
                      JSX Output{" "}
                      {componentName && `(${componentName}.${outputLanguage})`}
                    </span>
                    {isConverting && (
                      <span className="text-muted-foreground text-xs">
                        Converting...
                      </span>
                    )}
                    {options.useFormatter && !options.minify && (
                      <span className="text-muted-foreground text-xs">
                        (Prettier formatted)
                      </span>
                    )}
                  </div>
                </div>
                <div className="min-h-0 flex-1">
                  {jsxOutput ? (
                    <CodeEditor
                      value={jsxOutput}
                      language={outputLanguage}
                      readOnly
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-muted-foreground text-sm">
                        {isConverting
                          ? "Converting your SVG..."
                          : "Your converted JSX will appear here"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}
