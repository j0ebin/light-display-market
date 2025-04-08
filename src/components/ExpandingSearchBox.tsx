"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface ExpandingSearchBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  collapsedWidth?: string;
  expandedWidth?: string;
  onSearch?: (value: string) => void;
}

const ExpandingSearchBox = React.forwardRef<HTMLInputElement, ExpandingSearchBoxProps>(
  (
    {
      className,
      placeholder = "Search...",
      collapsedWidth = "40px",
      expandedWidth = "240px",
      onSearch,
      ...props
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);
    const combinedRef = useCombinedRefs(ref, inputRef);

    const handleFocus = () => {
      setIsExpanded(true);
    };

    const handleBlur = () => {
      if (!inputValue) {
        setIsExpanded(false);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onSearch) {
        onSearch(inputValue);
      }
    };

    return (
      <div className="relative">
        <motion.div
          animate={{
            width: isExpanded ? expandedWidth : collapsedWidth,
          }}
          initial={false}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          className="relative"
        >
          <Input
            ref={combinedRef}
            type="search"
            placeholder={isExpanded ? placeholder : ""}
            className={cn(
              "pe-9 ps-9 transition-all duration-300",
              !isExpanded && "cursor-pointer",
              className
            )}
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            aria-label="Search"
            {...props}
          />
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80",
              !isExpanded && "w-full cursor-pointer"
            )}
            onClick={() => {
              if (!isExpanded) {
                setIsExpanded(true);
                inputRef.current?.focus();
              }
            }}
          >
            <Search size={16} strokeWidth={2} aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    );
  }
);

ExpandingSearchBox.displayName = "ExpandingSearchBox";

// Helper function to combine refs
function useCombinedRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return React.useCallback((element: T) => {
    refs.forEach((ref) => {
      if (!ref) return;
      
      if (typeof ref === "function") {
        ref(element);
      } else {
        (ref as React.MutableRefObject<T>).current = element;
      }
    });
  }, [refs]);
}

export { ExpandingSearchBox }; 