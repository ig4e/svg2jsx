"use client";

import {
  ChevronLeft,
  ChevronRight,
  Code2,
  Copy,
  Download,
  Settings,
} from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import { useEffect, useState } from "react";
import { convertSvgToJsx, type ConversionOptions } from "~/lib/svg-to-jsx";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";

export function SvgToJsxConverter() {
  const [svgInput, setSvgInput] = useState("");
  const [jsxOutput, setJsxOutput] = useState("");
  const [componentName, setComponentName] = useState("MyIcon");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [options, setOptions] = useState<ConversionOptions>({
    typescript: true,
    memo: true,
    quotes: "double",
    passProps: true,
    minify: false,
  });

  // Convert SVG to JSX using the conversion utility
  const performConversion = () => {
    if (!svgInput.trim()) {
      setJsxOutput("");
      return;
    }

    const result = convertSvgToJsx(svgInput, componentName, options);
    setJsxOutput(result);
  };

  useEffect(() => {
    performConversion();
  }, [svgInput, componentName, options]);

  useEffect(() => {
    Prism.highlightAll();
  }, [jsxOutput]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsxOutput);
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
  };

  return (
    <div className="bg-background relative flex h-screen">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="absolute inset-0 z-10 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`border-border bg-card fixed top-0 left-0 z-20 h-full w-80 transform border-r transition-transform duration-300 ease-in-out lg:relative lg:z-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:w-0 lg:translate-x-0"} ${sidebarOpen ? "shadow-lg lg:shadow-none" : ""} `}
      >
        <div
          className={`${sidebarOpen ? "opacity-100" : "opacity-0 lg:opacity-0"} flex h-full flex-col overflow-hidden transition-opacity duration-300`}
        >
          <div className="flex-1 space-y-6 overflow-auto p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Configuration</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Component Name */}
              <div className="space-y-2">
                <Label htmlFor="component-name" className="text-sm font-medium">
                  Component Name
                </Label>
                <Textarea
                  id="component-name"
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                  placeholder="MyIcon"
                  className="min-h-[40px] resize-none"
                />
              </div>

              <Separator />

              {/* Advanced Options */}
              <div className="space-y-4">
                <h3 className="text-muted-foreground text-sm font-medium">
                  Advanced Options
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="props" className="text-sm">
                      Pass Props
                    </Label>
                    <Switch
                      id="props"
                      checked={options.passProps}
                      onCheckedChange={(checked) =>
                        setOptions((prev) => ({ ...prev, passProps: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="minify" className="text-sm">
                      Minify Output
                    </Label>
                    <Switch
                      id="minify"
                      checked={options.minify}
                      onCheckedChange={(checked) =>
                        setOptions((prev) => ({ ...prev, minify: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Quote Style */}
              <div className="space-y-3">
                <Label className="text-muted-foreground text-sm font-medium">
                  Quote Style
                </Label>
                <RadioGroup
                  value={options.quotes}
                  onValueChange={(value: "single" | "double") =>
                    setOptions((prev) => ({ ...prev, quotes: value }))
                  }
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="double" id="double" />
                    <Label htmlFor="double" className="text-sm">
                      Double quotes (")
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="single" id="single" />
                    <Label htmlFor="single" className="text-sm">
                      Single quotes (')
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Active Options */}
              <div className="space-y-3">
                <Label className="text-muted-foreground text-sm font-medium">
                  Active Options
                </Label>
                <div className="flex flex-wrap gap-1">
                  {options.typescript && (
                    <Badge variant="secondary" className="text-xs">
                      TypeScript
                    </Badge>
                  )}
                  {options.memo && (
                    <Badge variant="secondary" className="text-xs">
                      Memo
                    </Badge>
                  )}
                  {options.passProps && (
                    <Badge variant="secondary" className="text-xs">
                      Props
                    </Badge>
                  )}
                  {options.minify && (
                    <Badge variant="secondary" className="text-xs">
                      Minified
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {options.quotes === "single"
                      ? "Single quotes"
                      : "Double quotes"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex h-full flex-1 flex-col transition-all duration-300 ${sidebarOpen ? "lg:ml-0" : ""}`}
      >
        {/* Header */}
        <div className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="h-8 w-8 p-0"
              >
                {sidebarOpen ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              <div>
                <h1 className="text-2xl font-bold">SVG to JSX Converter</h1>
                <p className="text-muted-foreground text-sm">
                  Convert SVG code to React JSX components
                </p>
              </div>
            </div>

            {/* Quick Options */}
            <div className="flex items-center gap-4">
              {/* TypeScript Toggle */}
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="quick-typescript"
                  className="text-sm font-medium"
                >
                  TS
                </Label>
                <Switch
                  id="quick-typescript"
                  checked={options.typescript}
                  onCheckedChange={(checked) =>
                    setOptions((prev) => ({ ...prev, typescript: checked }))
                  }
                />
              </div>

              {/* Memo Toggle */}
              <div className="flex items-center gap-2">
                <Label htmlFor="quick-memo" className="text-sm font-medium">
                  Memo
                </Label>
                <Switch
                  id="quick-memo"
                  checked={options.memo}
                  onCheckedChange={(checked) =>
                    setOptions((prev) => ({ ...prev, memo: checked }))
                  }
                />
              </div>

              {/* Quote Style Quick Select */}
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Quotes</Label>
                <Select
                  value={options.quotes}
                  onValueChange={(value: "single" | "double") =>
                    setOptions((prev) => ({ ...prev, quotes: value }))
                  }
                >
                  <SelectTrigger className="h-8 w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="double">"</SelectItem>
                    <SelectItem value="single">'</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Action Buttons */}
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                disabled={!jsxOutput}
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadFile}
                disabled={!jsxOutput}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>

        {/* Editor Area with Resizable Panels */}
        <div className="flex-1">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Input Panel */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="flex h-full flex-col">
                <div className="border-border bg-muted/50 border-b px-6 py-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">SVG Input</span>
                  </div>
                </div>
                <div className="flex-1 p-6">
                  <Textarea
                    value={svgInput}
                    onChange={(e) => setSvgInput(e.target.value)}
                    placeholder="Paste your SVG code here..."
                    className="h-full min-h-[400px] resize-none border-0 p-0 font-mono text-sm shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Output Panel */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="flex h-full flex-col">
                <div className="border-border bg-muted/50 border-b px-6 py-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">
                      JSX Output{" "}
                      {componentName &&
                        `(${componentName}.${options.typescript ? "tsx" : "jsx"})`}
                    </span>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-6">
                  {jsxOutput ? (
                    <pre className="h-full">
                      <code
                        className={`language-${options.typescript ? "tsx" : "jsx"} text-sm`}
                        dangerouslySetInnerHTML={{
                          __html: Prism.highlight(
                            jsxOutput,
                            (Prism.languages[
                              options.typescript ? "tsx" : "jsx"
                            ] ||
                              Prism.languages.javascript ||
                              Prism.languages.markup ||
                              {}) as any,
                            options.typescript ? "tsx" : "jsx",
                          ),
                        }}
                      />
                    </pre>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-muted-foreground text-sm">
                        Your converted JSX will appear here
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
