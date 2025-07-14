"use client";

import {
  Code2,
  Download,
  FileType,
  Languages,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import { type ConversionOptions } from "~/lib/svg-to-jsx";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "./ui/menubar";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Switch } from "./ui/switch";

interface ConfigurationPanelProps {
  componentName: string;
  setComponentName: (name: string) => void;
  options: ConversionOptions;
  setOptions: (
    options:
      | ConversionOptions
      | ((prev: ConversionOptions) => ConversionOptions),
  ) => void;
}

export function ConfigurationPanel({
  componentName,
  setComponentName,
  options,
  setOptions,
}: ConfigurationPanelProps) {
  return (
    <div className="px-4 pb-4">
      <div className="bg-muted/30 border-border rounded-lg border p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground px-2 text-xs font-medium">
              Configuration:
            </span>

            <Menubar className="border-0 bg-transparent p-0">
              {/* Component Settings */}
              <MenubarMenu>
                <MenubarTrigger className="hover:bg-accent hover:text-accent-foreground hover:border-border cursor-pointer rounded-md border border-transparent px-3 py-2 text-sm font-medium transition-colors">
                  <FileType className="mr-2 h-4 w-4" />
                  Component
                </MenubarTrigger>
                <MenubarContent className="w-80">
                  <div className="p-4">
                    <Label
                      htmlFor="component-name"
                      className="text-sm font-medium"
                    >
                      Component Name
                    </Label>
                    <Input
                      id="component-name"
                      value={componentName}
                      onChange={(e) => setComponentName(e.target.value)}
                      placeholder="MyIcon"
                      className="mt-2"
                    />
                    <p className="text-muted-foreground mt-1 text-xs">
                      Name for your React component
                    </p>
                  </div>
                </MenubarContent>
              </MenubarMenu>

              {/* Export Style */}
              <MenubarMenu>
                <MenubarTrigger className="hover:bg-accent hover:text-accent-foreground hover:border-border cursor-pointer rounded-md border border-transparent px-3 py-2 text-sm font-medium transition-colors">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </MenubarTrigger>
                <MenubarContent className="w-72">
                  <div className="p-4">
                    <Label className="text-sm font-medium">Export Style</Label>
                    <RadioGroup
                      value={options.exportStyle}
                      onValueChange={(value: "const" | "default" | "named") =>
                        setOptions((prev) => ({ ...prev, exportStyle: value }))
                      }
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="const" id="export-const" />
                        <Label htmlFor="export-const" className="text-sm">
                          export const {componentName}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="default" id="export-default" />
                        <Label htmlFor="export-default" className="text-sm">
                          export default {componentName}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="named" id="export-named" />
                        <Label htmlFor="export-named" className="text-sm">
                          Named export with custom name
                        </Label>
                      </div>
                    </RadioGroup>

                    {options.exportStyle === "named" && (
                      <div className="mt-3">
                        <Label
                          htmlFor="export-name"
                          className="text-sm font-medium"
                        >
                          Export Name
                        </Label>
                        <Input
                          id="export-name"
                          value={options.exportName || componentName}
                          onChange={(e) =>
                            setOptions((prev) => ({
                              ...prev,
                              exportName: e.target.value,
                            }))
                          }
                          placeholder={componentName}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                </MenubarContent>
              </MenubarMenu>

              {/* Language Options */}
              <MenubarMenu>
                <MenubarTrigger className="hover:bg-accent hover:text-accent-foreground hover:border-border cursor-pointer rounded-md border border-transparent px-3 py-2 text-sm font-medium transition-colors">
                  <Languages className="mr-2 h-4 w-4" />
                  Language
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem
                    onClick={() =>
                      setOptions((prev) => ({
                        ...prev,
                        typescript: !prev.typescript,
                      }))
                    }
                    className="cursor-pointer"
                  >
                    <div className="flex w-full items-center justify-between">
                      <span>TypeScript</span>
                      <Switch
                        checked={options.typescript}
                        className="pointer-events-none ml-2"
                      />
                    </div>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem
                    onClick={() =>
                      setOptions((prev) => ({
                        ...prev,
                        quotes: prev.quotes === "single" ? "double" : "single",
                      }))
                    }
                    className="cursor-pointer"
                  >
                    <div className="flex w-full items-center justify-between">
                      <span>Quote Style</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {options.quotes === "single" ? "Single" : "Double"}
                      </Badge>
                    </div>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* React Options */}
              <MenubarMenu>
                <MenubarTrigger className="hover:bg-accent hover:text-accent-foreground hover:border-border cursor-pointer rounded-md border border-transparent px-3 py-2 text-sm font-medium transition-colors">
                  <Code2 className="mr-2 h-4 w-4" />
                  React
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem
                    onClick={() =>
                      setOptions((prev) => ({
                        ...prev,
                        memo: !prev.memo,
                      }))
                    }
                    className="cursor-pointer"
                  >
                    <div className="flex w-full items-center justify-between">
                      <span>React.memo</span>
                      <Switch
                        checked={options.memo}
                        className="pointer-events-none ml-2"
                      />
                    </div>
                  </MenubarItem>
                  <MenubarItem
                    onClick={() =>
                      setOptions((prev) => ({
                        ...prev,
                        passProps: !prev.passProps,
                      }))
                    }
                    className="cursor-pointer"
                  >
                    <div className="flex w-full items-center justify-between">
                      <span>Pass Props</span>
                      <Switch
                        checked={options.passProps}
                        className="pointer-events-none ml-2"
                      />
                    </div>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* SVGO Optimization */}
              <MenubarMenu>
                <MenubarTrigger className="hover:bg-accent hover:text-accent-foreground hover:border-border cursor-pointer rounded-md border border-transparent px-3 py-2 text-sm font-medium transition-colors">
                  <Settings className="mr-2 h-4 w-4" />
                  SVGO
                </MenubarTrigger>
                <MenubarContent className="w-72">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Optimize SVG
                      </Label>
                      <Switch
                        checked={options.optimizeSvg}
                        onCheckedChange={(checked) =>
                          setOptions((prev) => ({
                            ...prev,
                            optimizeSvg: checked,
                          }))
                        }
                      />
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Use SVGO to optimize SVG before conversion
                    </p>

                    {options.optimizeSvg && (
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Remove IDs</Label>
                          <Switch
                            checked={options.removeIds}
                            onCheckedChange={(checked) =>
                              setOptions((prev) => ({
                                ...prev,
                                removeIds: checked,
                              }))
                            }
                          />
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Advanced SVG optimization with viewBox preservation
                          and ID cleanup
                        </p>
                      </div>
                    )}
                  </div>
                </MenubarContent>
              </MenubarMenu>

              {/* Prettier Formatting */}
              <MenubarMenu>
                <MenubarTrigger className="hover:bg-accent hover:text-accent-foreground hover:border-border cursor-pointer rounded-md border border-transparent px-3 py-2 text-sm font-medium transition-colors">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Format
                </MenubarTrigger>
                <MenubarContent className="w-72">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Use Prettier
                      </Label>
                      <Switch
                        checked={options.useFormatter}
                        onCheckedChange={(checked) =>
                          setOptions((prev) => ({
                            ...prev,
                            useFormatter: checked,
                          }))
                        }
                      />
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Format code with Prettier for better readability
                    </p>

                    {options.useFormatter && (
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Print Width</Label>
                          <Input
                            type="number"
                            value={options.prettierConfig?.printWidth ?? 80}
                            onChange={(e) =>
                              setOptions((prev) => ({
                                ...prev,
                                prettierConfig: {
                                  ...prev.prettierConfig,
                                  printWidth: parseInt(e.target.value) || 80,
                                },
                              }))
                            }
                            className="h-6 w-16 text-xs"
                            min="40"
                            max="200"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Tab Width</Label>
                          <Input
                            type="number"
                            value={options.prettierConfig?.tabWidth ?? 2}
                            onChange={(e) =>
                              setOptions((prev) => ({
                                ...prev,
                                prettierConfig: {
                                  ...prev.prettierConfig,
                                  tabWidth: parseInt(e.target.value) || 2,
                                },
                              }))
                            }
                            className="h-6 w-16 text-xs"
                            min="1"
                            max="8"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Semicolons</Label>
                          <Switch
                            checked={options.prettierConfig?.semi ?? true}
                            onCheckedChange={(checked) =>
                              setOptions((prev) => ({
                                ...prev,
                                prettierConfig: {
                                  ...prev.prettierConfig,
                                  semi: checked,
                                },
                              }))
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </MenubarContent>
              </MenubarMenu>

              {/* Output Options */}
              <MenubarMenu>
                <MenubarTrigger className="hover:bg-accent hover:text-accent-foreground hover:border-border cursor-pointer rounded-md border border-transparent px-3 py-2 text-sm font-medium transition-colors">
                  <Zap className="mr-2 h-4 w-4" />
                  Output
                </MenubarTrigger>
                <MenubarContent>
                  {!options.optimizeSvg && (
                    <>
                      <MenubarItem
                        onClick={() =>
                          setOptions((prev) => ({
                            ...prev,
                            removeIds: !prev.removeIds,
                          }))
                        }
                        className="cursor-pointer"
                      >
                        <div className="flex w-full items-center justify-between">
                          <span>Remove IDs</span>
                          <Switch
                            checked={options.removeIds}
                            className="pointer-events-none ml-2"
                          />
                        </div>
                      </MenubarItem>
                      <MenubarSeparator />
                    </>
                  )}
                  <MenubarItem
                    onClick={() =>
                      setOptions((prev) => ({
                        ...prev,
                        minify: !prev.minify,
                      }))
                    }
                    className="cursor-pointer"
                  >
                    <div className="flex w-full items-center justify-between">
                      <span>Minify</span>
                      <Switch
                        checked={options.minify}
                        className="pointer-events-none ml-2"
                      />
                    </div>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>

          {/* Active Options Display */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-medium">
              Active:
            </span>
            <div className="flex items-center gap-1">
              {options.typescript && (
                <Badge variant="secondary" className="h-5 text-xs">
                  TS
                </Badge>
              )}
              {options.memo && (
                <Badge variant="secondary" className="h-5 text-xs">
                  Memo
                </Badge>
              )}
              {options.passProps && (
                <Badge variant="secondary" className="h-5 text-xs">
                  Props
                </Badge>
              )}
              {options.optimizeSvg && (
                <Badge variant="secondary" className="h-5 text-xs">
                  SVGO
                </Badge>
              )}
              {options.useFormatter && (
                <Badge variant="secondary" className="h-5 text-xs">
                  Prettier
                </Badge>
              )}
              {options.removeIds && (
                <Badge variant="secondary" className="h-5 text-xs">
                  No IDs
                </Badge>
              )}
              {options.minify && (
                <Badge variant="secondary" className="h-5 text-xs">
                  Min
                </Badge>
              )}
              <Badge variant="outline" className="h-5 text-xs">
                {options.exportStyle === "const"
                  ? "const"
                  : options.exportStyle === "default"
                    ? "default"
                    : "named"}
              </Badge>
              <Badge variant="outline" className="h-5 text-xs">
                {options.quotes === "single" ? "'" : '"'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
