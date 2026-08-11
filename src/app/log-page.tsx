import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, Trash } from "@hugeicons/core-free-icons";
import { motion, AnimatePresence } from "motion/react";
import moment from "moment";

moment.locale("en-short", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "1s",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    w: "1w",
    ww: "%dw",
    M: "1mo",
    MM: "%dmo",
    y: "1yr",
    yy: "%dyr",
  },
});

import { type ConversionLogType } from "../types/app.types";
import { useConversionLogStore } from "../stores/use-conversion-log.store";

import { Button } from "../components/ui/button";
import { Empty, EmptyDescription, EmptyTitle } from "../components/ui/empty";
import { formatCurrency, unformatToNumber } from "../utils/currency.utils";

export default function LogPage() {
  const conversionLogs = useConversionLogStore((s) => s.logs);
  const clearConversions = useConversionLogStore((s) => s.clearLog);

  if (!conversionLogs.length)
    return (
      <Empty>
        <EmptyTitle>No conversions logged yet</EmptyTitle>
        <EmptyDescription>
          Every conversion is recorded here automatically when you tap LOG CONVERSION.
          <br className="xl:block hidden" /> Your log is private to this session and this browser.
        </EmptyDescription>
      </Empty>
    );

  return (
    <motion.section initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="px-4 py-5 rounded-2xl flex flex-col gap-5 md:px-5 bg-neutral-700 border border-neutral-600">
      <div className="flex flex-col gap-2.5 md:flex-row md:justify-between">
        <h3 className="tracking-widest uppercase text-neutral-50 text-base">Conversion Log</h3>

        <div className="flex items-center justify-between md:gap-4 md:flex-row">
          <p className="text-xs uppercase text-neutral-50/70">{conversionLogs.length} Logged</p>

          <Button onClick={clearConversions} intent="secondary" className="tracking-widest text-neutral-200">
            CLEAR ALL
          </Button>
        </div>
      </div>

      <motion.ul layout className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {conversionLogs.map((log) => (
            <ConversionLogListItem key={log.id} log={log} />
          ))}
        </AnimatePresence>
      </motion.ul>
    </motion.section>
  );
}

type ConversionLogListItemProps = {
  log: ConversionLogType;
};

function ConversionLogListItem(props: ConversionLogListItemProps) {
  const removeFromLog = useConversionLogStore((s) => s.removeFromLog);
  const { log } = props;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className="flex bg-neutral-600 border border-neutral-500 hover:border-neutral-300 transition-all rounded-[10px] p-3 py-2 gap-2.5 md:gap-4 md:p-4 items-center"
    >
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[56px_1fr] md:gap-8 gap-1">
        <p className="text-sm text-neutral-200 uppercase tracking-wide">{moment(log.time).fromNow(true)}</p>

        <div className="text-neutral-50 uppercase text-sm flex items-center gap-2 tracking-wide">
          <p>{log.base_currency}</p>
          <HugeiconsIcon icon={ArrowRight02Icon} size={16} className="text-neutral-200" />
          <p>{log.target_currency}</p>
        </div>
      </div>

      <div className="flex flex-col text-base md:flex-row md:gap-5 tracking-wide">
        <p className="text-neutral-100">{formatCurrency(unformatToNumber(log.base_amount))}</p>
        <p className="text-lime-500">{formatCurrency(unformatToNumber(log.converted_amount))}</p>
      </div>

      <Button intent="secondary" size="icon" onClick={() => removeFromLog(log.id)}>
        <HugeiconsIcon icon={Trash} size={12} />
      </Button>
    </motion.li>
  );
}
