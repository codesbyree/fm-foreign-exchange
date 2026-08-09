import { createContext, useContext, useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import { cn } from "../../utils/style.utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronDownIcon } from "@hugeicons/core-free-icons";
import { useOutsideClick } from "../../hooks/use-click-outside";

type TabContextType = {
  hrefs: string[];
  registerHref: (href: string) => void;
  current: string;
  setCurrent: (href: string) => void;
  focused: boolean;
  setFocused: (state: boolean) => void;
  closeMenu: () => void;
};

const TabContext = createContext<TabContextType | undefined>(undefined);

function useTabContext() {
  const context = useContext(TabContext);
  if (!context) throw new Error("Tab Menu sub-components must be rendered within a <TabMenu/> parent.");
  return context;
}

type TabMenuProps = ComponentPropsWithoutRef<"ul"> & {
  initial: string;
};

export function TabMenu(props: TabMenuProps) {
  const { children, className, initial } = props;

  const [current, setCurrent] = useState(initial);
  const [focused, setFocused] = useState(false);
  const [hrefs, setHrefs] = useState<string[]>([]);
  const [opened, setOpened] = useState(false);

  const parentRef = useOutsideClick(() => {
    setOpened(false);
  });

  const closeMenu = () => setOpened(false);

  const registerHref = (href: string) => {
    setHrefs((prev) => {
      // Prevent duplicates safely
      if (prev.includes(href)) return prev;
      return [...prev, href];
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = hrefs.indexOf(current);
    if (currentIndex === -1) return;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const nextIndex = currentIndex > 0 ? currentIndex - 1 : hrefs.length - 1;
      setCurrent(hrefs[nextIndex]);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = currentIndex < hrefs.length - 1 ? currentIndex + 1 : 0;
      setCurrent(hrefs[nextIndex]);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const nextIndex = currentIndex > 0 ? currentIndex - 1 : hrefs.length - 1;
      setCurrent(hrefs[nextIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = currentIndex < hrefs.length - 1 ? currentIndex + 1 : 0;
      setCurrent(hrefs[nextIndex]);
    }
  };

  return (
    <TabContext.Provider value={{ current, setCurrent, focused, setFocused, hrefs, registerHref, closeMenu }}>
      <div className="relative" onKeyDown={handleKeyDown} ref={parentRef}>
        <button
          onClick={() => setOpened(!opened)}
          className="uppercase text-neutral-50 border border-neutral-400 rounded-lg h-10 px-3 flex items-center justify-between gap-4 bg-neutral-700 w-full md:hidden"
        >
          {current.split("/")[1]}

          <HugeiconsIcon icon={ChevronDownIcon} className={cn("w-5 transition-all", opened && "rotate-180")} />
        </button>

        <nav
          className={cn(
            "absolute md:static bg-neutral-700 p-2 border border-neutral-600 rounded-[10px] w-full md:p-0 md:border-none md:bg-transparent pointer-events-none opacity-0 transition-all md:pointer-events-auto! md:opacity-100! z-20",
            opened && "opacity-100 pointer-events-auto",
          )}
        >
          <ul className={cn("flex flex-col md:flex-row items-center md:gap-2 md:border-b border-neutral-600", className)}>{children}</ul>
        </nav>
      </div>
    </TabContext.Provider>
  );
}

type TabMenuItemProps = ComponentPropsWithoutRef<"a"> & {
  href: string;
};

export function TabMenuItem(props: TabMenuItemProps) {
  const { children, className, href } = props;

  const { setFocused, setCurrent, registerHref, current, closeMenu } = useTabContext();

  const itemRef = useRef<HTMLAnchorElement | null>(null);
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  // Cleaned up URL string generation
  const handleMenuHref = (href: string, currentSearchParams: URLSearchParams) => {
    const paramsStr = currentSearchParams.toString();
    return paramsStr ? `${href}?${paramsStr}` : href;
  };

  const isActivePath = pathname === href;

  // Register this tab's href into the context on mount
  useEffect(() => {
    registerHref(href);
  }, [href, registerHref]);

  // Handle focus when the current tab changes via keyboard
  useEffect(() => {
    if (current === href && itemRef.current) {
      itemRef.current.focus();
    }
  }, [current, href]);

  const handleFocus = () => {
    setFocused(true);
    setCurrent(href);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  return (
    <li className="w-full md:w-max">
      <Link
        ref={itemRef}
        to={handleMenuHref(href, searchParams)}
        className={cn(
          "w-full justify-between focus:bg-neutral-600 md:w-max md:bg-neutral-900! md:hover:bg-neutral-600 transition-all uppercase text-base text-neutral-50 tracking-widest px-2 md:px-4 flex items-center gap-2 h-10.5 md:border-2 border-transparent md:focus-visible:border-lime-500 md:focus-visible:rounded-md outline-none",
          isActivePath && "md:border-b-lime-500 bg-neutral-600",
          className,
        )}
        tabIndex={current === href ? 0 : -1}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={closeMenu}
      >
        {children}
      </Link>
    </li>
  );
}

type TabMenuNotificationProps = ComponentPropsWithoutRef<"span">;

export function TabMenuNotification(props: TabMenuNotificationProps) {
  const { className, children } = props;

  return <span className={cn("text-2xs text-lime-500 bg-lime-800 w-5 h-5 rounded-full grid place-items-center tracking-normal", className)}>{children}</span>;
}
