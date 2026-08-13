import { HugeiconsIcon } from "@hugeicons/react";
import { EqualSignIcon, TriangleIcon } from "@hugeicons/core-free-icons";
import { motion, type HTMLMotionProps } from "motion/react";

import { cn } from "../../../utils/style.utils";
import { formatCurrency } from "../../../utils/currency.utils";
import type { RateHistoryData } from "../../../types/app.types";

import { Card, CardContent, CardTitle } from "../card";

type Props = HTMLMotionProps<"div"> & Omit<RateHistoryData, "chart_data">;

export default function ConversionStats(props: Props) {
  const { open, last, change, growth, growth_percentage, className, ...rest } = props;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className={cn("grid grid-cols-2 gap-2.5 md:flex md:gap-4 xl:flex-1", className)}
      {...rest}
    >
      <Card className="md:min-w-35">
        <CardTitle>OPEN</CardTitle>
        <CardContent>
          <p className="text-xl text-neutral-50 tracking-wide">{formatCurrency(open)}</p>
        </CardContent>
      </Card>

      <Card className="md:min-w-35">
        <CardTitle>LAST</CardTitle>
        <CardContent>
          <p className="text-xl text-neutral-50 tracking-wide">{formatCurrency(last)}</p>
        </CardContent>
      </Card>

      <Card className="md:min-w-35">
        <CardTitle>CHANGE</CardTitle>
        <CardContent>
          <p className="text-xl text-lime-500 tracking-wide">{change}</p>
        </CardContent>
      </Card>

      <Card className="md:min-w-35">
        <CardTitle>% CHANGE</CardTitle>
        <CardContent className={cn("flex gap-3 items-center", growth === "positive" ? "text-lime-500" : growth === "negative" ? "text-red-500" : "text-neutral-200")}>
          {growth === "positive" ? (
            <HugeiconsIcon icon={TriangleIcon} aria-hidden="true" fill="currentColor" size={15} />
          ) : growth === "negative" ? (
            <HugeiconsIcon icon={TriangleIcon} className={cn(growth === "negative" && "rotate-180")} aria-hidden="true" fill="currentColor" size={15} />
          ) : (
            <HugeiconsIcon icon={EqualSignIcon} aria-hidden="true" fill="currentColor" size={15} />
          )}
          <p className="text-xl tracking-wide">{growth_percentage}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
