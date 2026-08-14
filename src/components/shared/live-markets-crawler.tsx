import { HugeiconsIcon } from "@hugeicons/react";
import { TriangleIcon } from "@hugeicons/core-free-icons";
import { motion } from "motion/react";

import type { CrawlerData } from "../../types/app.types";
import { cn } from "../../utils/style.utils";
import { getCrawlerData } from "../../helpers/api.helper";

import { Marquee } from "../ui/marquee";
import { useQuery } from "@tanstack/react-query";

export default function LiveMarketCrawler() {
  const { data, isLoading } = useQuery({ queryKey: ["crawlerData"], queryFn: getCrawlerData, staleTime: 5 * 60 * 1000 });

  if (isLoading) return <div className="h-8.5 md:h-10"></div>;
  if (!data) return null;

  const myStyle = {
    ["--duration" as string]: `${data.length * 2}s`,
  };

  return (
    <motion.div
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      initial={{ y: -5, opacity: 0, filter: "blur(8px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      role="section"
      className="flex"
    >
      <p className="text-2xs md:text-xs uppercase tracking-wide text-neutral-900 bg-lime-500 h-8.5 md:h-10 px-3 md:px-4 flex items-center">
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 inline-block mr-2 shrink-0 animate-pulse" />
        <span className="text-nowrap">Live Markets</span>
      </p>

      <Marquee style={myStyle} className={cn("p-0 gap-0 bg-neutral-700")} pauseOnHover>
        {data.map((d) => (
          <CrawlerItem key={d.id} data={d} />
        ))}
      </Marquee>
    </motion.div>
  );
}

type CrawlerItemProps = {
  data: CrawlerData;
};

function CrawlerItem(props: CrawlerItemProps) {
  const { data } = props;

  return (
    <div className="flex items-center text-2xs md:text-xs tracking-wide gap-2.5 first:border-l border-r border-neutral-500 pr-3 md:pr-5 first:pl-3 md:first:pl-5">
      <p className="text-neutral-200">
        {data.base}/{data.quote}
      </p>
      <p className="text-neutral-50">{data.diff}</p>
      <p className={cn("flex items-center gap-1", data.growth === "positive" ? "text-green-500" : data.growth === "negative" ? "text-red-500" : "text-neutral-200")}>
        {data.growth === "positive" ? (
          <HugeiconsIcon icon={TriangleIcon} className={cn("w-1.5 md:w-2")} aria-hidden="true" fill="currentColor" />
        ) : data.growth === "negative" ? (
          <HugeiconsIcon icon={TriangleIcon} className={cn("w-1.5 md:w-2", data.growth === "negative" && "rotate-180")} aria-hidden="true" fill="currentColor" />
        ) : (
          <span></span>
        )}
        <span>{data.growth_percentage}</span>
      </p>
    </div>
  );
}
