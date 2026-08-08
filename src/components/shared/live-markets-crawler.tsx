import { cn } from "../../utils/style.utils";

import { Marquee } from "../ui/marquee";
import { HugeiconsIcon } from "@hugeicons/react";
import { TriangleIcon } from "@hugeicons/core-free-icons";

export default function LiveMarketCrawler() {
  return (
    <div role="section" className="flex">
      <p className="text-2xs md:text-xs uppercase tracking-wide text-neutral-900 bg-lime-500 h-8.5 md:h-10 px-3 md:px-4 flex items-center">
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 inline-block mr-2 shrink-0" />
        <span className="text-nowrap">Live Markets</span>
      </p>

      <Marquee className="[--duration:15s] p-0 gap-0 bg-neutral-700" pauseOnHover>
        <CrawlerItem exchange="USD/IDR" value={1} percentage={0.25} status="decrease" />
        <CrawlerItem exchange="USD/IDR" value={2} percentage={0.25} status="decrease" />
        <CrawlerItem exchange="USD/IDR" value={3} percentage={0.25} status="increase" />
        <CrawlerItem exchange="USD/IDR" value={4} percentage={0.25} status="increase" />
        <CrawlerItem exchange="USD/IDR" value={5} percentage={0.25} status="decrease" />
        <CrawlerItem exchange="USD/IDR" value={6} percentage={0.25} status="increase" />
      </Marquee>
    </div>
  );
}

type CrawlerItemProps = {
  exchange: string;
  value: number;
  percentage: number;
  status: "increase" | "decrease";
};

function CrawlerItem(props: CrawlerItemProps) {
  const { exchange, value, percentage, status } = props;

  return (
    <div className="flex items-center text-2xs md:text-xs tracking-wide gap-2.5 first:border-l border-r border-neutral-500 pr-3 md:pr-5 first:pl-3 md:first:pl-5">
      <p className="text-neutral-200">{exchange}</p>
      <p className="text-neutral-50">{value}</p>
      <p className={cn("flex items-center gap-2", status === "increase" ? "text-green-500" : "text-red-500")}>
        <HugeiconsIcon icon={TriangleIcon} className={cn("w-1.5 md:w-2", status === "decrease" && "rotate-180")} aria-hidden="true" fill="currentColor" />
        <span>{percentage}%</span>
      </p>
    </div>
  );
}
