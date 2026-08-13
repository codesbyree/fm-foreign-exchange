import { motion } from "motion/react";
import { useSearchParams } from "react-router";

import type { DateRangeTypes } from "../../../types/app.types";

const tabs: DateRangeTypes[] = ["1d", "1w", "1m", "3m", "1y", "5y"];

export default function HistoryRangeTab() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedTab: DateRangeTypes = (searchParams.get("tab") ?? "1m") as DateRangeTypes;

  const updateSelectedTab = (tab: DateRangeTypes) => {
    const currentSearchParams = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...currentSearchParams, tab });
  };

  return (
    <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 320, damping: 32 }}>
      <ul className="p-0.5 rounded-lg bg-neutral-700 flex items-center w-max">
        {tabs.map((item) => (
          <motion.li key={item} initial={false}>
            <button
              onClick={() => updateSelectedTab(item)}
              className="px-4 py-3 rounded-md text-xs text-neutral-200 w-max cursor-pointer border-none outline outline-transparent focus-visible:outline-lime-500 relative uppercase hover:bg-neutral-500 transition-all"
            >
              <span className="z-20 relative">{`${item}`}</span>
              {item === selectedTab ? <motion.div layoutId="underline" id="underline" className="absolute w-full h-full bg-neutral-500 pointer-events-none top-0 left-0 z-0 rounded-md" /> : null}
            </button>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  );
}
