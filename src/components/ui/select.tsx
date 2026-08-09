import { createContext, useContext, useState, useRef, useEffect, type ComponentPropsWithoutRef } from "react";
import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react";
import { cn } from "../../utils/style.utils";
import { Button, type ButtonProps } from "./button";
import { useOutsideClick } from "../../hooks/use-click-outside";
import Input from "./input";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckIcon, Search02Icon } from "@hugeicons/core-free-icons";

type SelectContextType = {
  open: boolean;
  setOpen: (state: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

const SelectContext = createContext<SelectContextType | undefined>(undefined);

function useSelectContext() {
  const context = useContext(SelectContext);
  if (!context) throw new Error("Component should be used within <Select/> parent.");
  return context;
}

export function Select({ className, children, ...rest }: ComponentPropsWithoutRef<"div">) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const parentRef = useOutsideClick(() => setOpen(false));

  return (
    <SelectContext.Provider value={{ open, setOpen, triggerRef }}>
      <div ref={parentRef} className={cn("relative", className)} {...rest}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className, disabled, ...rest }: ButtonProps) {
  const { setOpen, open, triggerRef } = useSelectContext();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  };

  return (
    <Button
      type="button"
      ref={triggerRef}
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
      intent="secondary"
      onClick={() => setOpen(!open)}
      onKeyDown={handleKeyDown}
      className={cn("bg-neutral-500 hover:bg-neutral-400 border-neutral-400 focus:ring-2 focus:ring-white outline-none", className)}
      disabled={disabled}
      {...rest}
    >
      {children}
    </Button>
  );
}

export function SelectContent({ className, children, align = "end", ...rest }: HTMLMotionProps<"div"> & { align?: "start" | "end" | "center" }) {
  const { open, setOpen } = useSelectContext();
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-focus the search input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const input = contentRef.current?.querySelector("input");
        if (input) input.focus();
      }, 50); // slight delay to allow animation to render
    }
  }, [open]);

  // Handle arrow key navigation globally within the dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!contentRef.current) return;

    // Find all focusable elements inside the dropdown
    const focusables = Array.from(contentRef.current.querySelectorAll('input, [role="option"]')) as HTMLElement[];
    const currentIndex = focusables.indexOf(document.activeElement as HTMLElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % focusables.length;
      focusables[nextIndex]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + focusables.length) % focusables.length;
      focusables[prevIndex]?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={contentRef}
          role="listbox"
          onKeyDown={handleKeyDown}
          initial={{ opacity: 0, top: 56 }}
          exit={{ opacity: 0, top: 56 }}
          animate={{ opacity: 1, top: 48 }}
          className={cn(
            "absolute z-20 bg-neutral-600 border border-neutral-400 rounded-lg w-94 shadow-xl max-h-116.5 overflow-auto no-scrollbar",
            align === "center" && "left-1/2 -translate-y-1/2",
            align === "end" && "right-0",
            align === "start" && "left-0",
            className,
          )}
          {...rest}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Update to accept onSelect instead of onChange
export function SelectItem({ className, children, onSelect, ...rest }: ComponentPropsWithoutRef<"li"> & { onSelect?: () => void }) {
  const { setOpen, triggerRef } = useSelectContext();

  const handleSelect = () => {
    onSelect?.();
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <li
      role="option"
      tabIndex={-1}
      onClick={handleSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelect();
        }
      }}
      className={cn(
        "aria-selected:[&>svg]:opacity-100 flex items-center gap-2 justify-between h-11.5 px-2 py-3 cursor-pointer bg-neutral-600 hover:bg-neutral-500 focus:bg-neutral-500 transition-colors rounded-sm outline-none focus:ring-1 focus:ring-inset focus:ring-neutral-50",
        className,
      )}
      {...rest}
    >
      {children}
      <HugeiconsIcon icon={CheckIcon} className="text-neutral-50 w-4 opacity-0" />
    </li>
  );
}

export function SelectGroup(props: ComponentPropsWithoutRef<"ul">) {
  return (
    <ul className={cn("p-2", props.className)} {...props}>
      {props.children}
    </ul>
  );
}

export function SelectLabel(props: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("p-2 flex items-center justify-between uppercase text-xs text-neutral-200 border-b border-neutral-500 tracking-widest mb-1", props.className)} {...props}>
      {props.children}
    </div>
  );
}

export function SelectSearchFilter(props: ComponentPropsWithoutRef<"input">) {
  return (
    <div className="sticky top-0 bg-neutral-600 p-2 z-10">
      <Input className="h-11.5 pl-9 outline-neutral-200 placeholder:text-xs" {...props} />
      <HugeiconsIcon icon={Search02Icon} className="text-neutral-50 w-4 absolute top-1/2 -translate-y-1/2 left-4.5" />
    </div>
  );
}
