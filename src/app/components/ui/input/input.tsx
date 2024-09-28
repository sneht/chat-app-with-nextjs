import { SearchIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex h-11 items-center rounded-md border border-input bg-white pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2",
          className
        )}
      >
        <SearchIcon className="h-4 w-4 text-gray-600" />
        <input
          {...props}
          type="search"
          ref={ref}
          className="w-full border-none p-2 border-0 placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

const Input = React.forwardRef<
  HTMLInputElement,
  InputProps & {
    isWidthFull?: boolean;
  }
>(({ className, children, type, isWidthFull, ...props }, ref) => {
  return (
    <div className={`relative ${isWidthFull ? "w-full" : ""}`}>
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
      <div className="absolute inset-y-0 right-0 flex items-center mr-3">
        {children}
      </div>
    </div>
  );
});
Input.displayName = "Input";

export { Input, SearchInput };
