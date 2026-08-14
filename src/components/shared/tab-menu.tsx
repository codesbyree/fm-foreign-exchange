import { createContext, useContext, useEffect, useRef, useState, useTransition, type ComponentPropsWithoutRef } from "react";
import { Link, useLocation, useSearchParams, useNavigate } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronDownIcon } from "@hugeicons/core-free-icons";
import { motion } from "motion/react";

import { cn } from "../../utils/style.utils";
import { useOutsideClick } from "../../hooks/use-click-outside";

type TabContextType = {
  hrefs: string[];
  registerHref: (href: string) => void;
  current: string;
  setCurrent: (href: string) => void;
  focused: boolean;
  setFocused: (state: boolean) => void;
  closeMenu: () => void;
  pendingPath: string | null;
  startTabNavigation: (targetUrl: string, href: string) => void;
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
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const navigate = useNavigate();
  const [, startTransition] = useTransition();

  const parentRef = useOutsideClick(() => {
    setOpened(false);
  });

  const closeMenu = () => setOpened(false);

  const registerHref = (href: string) => {
    setHrefs((prev) => {
      if (prev.includes(href)) return prev;
      return [...prev, href];
    });
  };

  const startTabNavigation = (targetUrl: string, href: string) => {
    setPendingPath(href);
    startTransition(() => {
      navigate(targetUrl);
      setPendingPath(null);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = hrefs.indexOf(current);
    if (currentIndex === -1) return;

    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const nextIndex = currentIndex > 0 ? currentIndex - 1 : hrefs.length - 1;
      setCurrent(hrefs[nextIndex]);
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = currentIndex < hrefs.length - 1 ? currentIndex + 1 : 0;
      setCurrent(hrefs[nextIndex]);
    }
  };

  return (
    <TabContext.Provider value={{ current, setCurrent, focused, setFocused, hrefs, registerHref, closeMenu, pendingPath, startTabNavigation }}>
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
  const { setFocused, setCurrent, registerHref, current, closeMenu, pendingPath, startTabNavigation } = useTabContext();

  const itemRef = useRef<HTMLAnchorElement | null>(null);
  const isInitialMount = useRef(true);
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  const handleMenuHref = (href: string, currentSearchParams: URLSearchParams) => {
    const paramsStr = currentSearchParams.toString();
    return paramsStr ? `${href}?${paramsStr}` : href;
  };

  const isActivePath = pendingPath ? pendingPath === href : pathname === href;

  useEffect(() => {
    registerHref(href);
  }, [href, registerHref]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    closeMenu();

    if (pathname === href && !pendingPath) return;

    startTabNavigation(handleMenuHref(href, searchParams), href);
  };

  return (
    <li className="w-full md:w-max">
      <Link
        ref={itemRef}
        to={handleMenuHref(href, searchParams)}
        onClick={handleClick}
        className={cn(
          "relative w-full justify-between focus-visible:bg-neutral-600 md:w-max md:bg-neutral-900! md:hover:bg-neutral-600 transition-all uppercase text-base text-neutral-50 tracking-widest px-2 md:px-4 flex items-center gap-2 h-10.5 md:border-2 border-transparent md:focus-visible:border-lime-500 md:rounded-md outline-none",
          className,
        )}
        tabIndex={current === href ? 0 : -1}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {children}
        {isActivePath ? <motion.div layoutId="tab-menu-active" id="tab-menu-active" className="absolute w-full h-0.5 bg-lime-500 bottom-0 left-0" /> : null}
      </Link>
    </li>
  );
}

type TabMenuNotificationProps = ComponentPropsWithoutRef<"span">;

export function TabMenuNotification(props: TabMenuNotificationProps) {
  const { className, children } = props;
  return <span className={cn("text-2xs text-lime-500 bg-lime-800 w-5 h-5 rounded-full grid place-items-center tracking-normal", className)}>{children}</span>;
}
