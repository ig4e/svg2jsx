"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { codeToHtml } from "shiki";
import { cn } from "~/lib/utils";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language: string;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

export function CodeEditor({
  value,
  onChange,
  language,
  placeholder,
  readOnly = false,
  className,
}: CodeEditorProps) {
  const [highlightedHtml, setHighlightedHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize language names for Shiki
  const normalizeLanguage = (lang: string): string => {
    switch (lang.toLowerCase()) {
      case "jsx":
      case "tsx":
        return "tsx";
      case "xml":
      case "svg":
        return "xml";
      case "js":
        return "javascript";
      case "ts":
        return "typescript";
      default:
        return "javascript";
    }
  };

  // Generate syntax highlighted HTML with debouncing
  const highlightCode = useCallback(
    async (code: string) => {
      if (!code.trim()) {
        setHighlightedHtml("");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const html = await codeToHtml(code, {
          lang: normalizeLanguage(language),
          theme: "github-dark",
        });
        setHighlightedHtml(html);
      } catch (error) {
        console.error("Syntax highlighting failed:", error);
        setHighlightedHtml(`<pre><code>${code}</code></pre>`);
      } finally {
        setIsLoading(false);
      }
    },
    [language],
  );

  // Debounced highlighting
  useEffect(() => {
    const timer = setTimeout(() => {
      highlightCode(value);
    }, 150); // 150ms debounce

    return () => clearTimeout(timer);
  }, [value, highlightCode]);

  // Sync scroll positions between textarea and highlighted code
  const syncScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current) {
      const textarea = textareaRef.current;
      const highlight = highlightRef.current;

      highlight.scrollTop = textarea.scrollTop;
      highlight.scrollLeft = textarea.scrollLeft;
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange && !readOnly) {
      onChange(e.target.value);
    }
  };

  const handleScroll = () => {
    syncScroll();
  };

  // Focus management
  const handleContainerClick = () => {
    if (!readOnly && textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "bg-background border-border relative h-full w-full overflow-hidden rounded-md border",
        "transition-all duration-200 ease-in-out",
        !readOnly && "hover:border-border/80 cursor-text hover:shadow-sm",
        readOnly && "cursor-default",
        className,
      )}
      onClick={handleContainerClick}
    >
      {/* Syntax highlighted background */}
      <div className="absolute inset-0 overflow-auto">
        {highlightedHtml ? (
          <div
            ref={highlightRef}
            className={cn(
              "h-full w-full transition-opacity duration-200",
              "[&>pre]:m-0 [&>pre]:min-h-full [&>pre]:overflow-visible [&>pre]:!bg-transparent [&>pre]:p-4 [&>pre]:text-sm [&>pre]:leading-6",
              "[&>pre>code]:block [&>pre>code]:min-h-full [&>pre>code]:font-mono",
              isLoading && "opacity-70",
            )}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            style={{
              overflow: "auto",
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-4">
            <span className="text-muted-foreground text-sm">
              {placeholder || (readOnly ? "No content" : "Start typing...")}
            </span>
          </div>
        )}
      </div>

      {/* Invisible textarea overlay for input */}
      {!readOnly && (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onScroll={handleScroll}
          placeholder={placeholder}
          className={cn(
            "absolute inset-0 h-full w-full resize-none bg-transparent p-4 font-mono text-sm leading-6 text-transparent caret-white outline-none",
            "selection:bg-blue-500/30",
            "placeholder:text-muted-foreground/50",
          )}
          style={{
            color: "transparent",
            caretColor: "white",
            WebkitTextFillColor: "transparent",
          }}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          wrap="off"
        />
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-2 right-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500/60" />
        </div>
      )}

      {/* Read-only indicator */}
      {readOnly && value && (
        <div className="absolute right-2 bottom-2">
          <span className="text-muted-foreground text-xs">Read-only</span>
        </div>
      )}
    </div>
  );
}
