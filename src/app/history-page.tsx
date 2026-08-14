import { useSearchParams } from "react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { getRatesHistory } from "../helpers/api.helper";
import type { DateRangeTypes } from "../types/app.types";

import { Empty, EmptyDescription, EmptyTitle } from "../components/ui/empty";
import ConversionStats from "../components/shared/history/conversion-stats";
import HistoryRangeTab from "../components/shared/history/history-range-tab";
import RateHistoryChart from "../components/shared/history/rate-history-chart";

export default function HistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const baseCurrency = searchParams.get("base");
  const targetCurrency = searchParams.get("quote");
  const duration = searchParams.get("tab");

  const { data } = useQuery({
    queryKey: [baseCurrency, targetCurrency, duration],
    queryFn: () => getRatesHistory(baseCurrency ?? "usd", targetCurrency ?? "idr", (duration ?? "1m") as DateRangeTypes),
    enabled: !!baseCurrency && !!targetCurrency && !!duration,
    staleTime: 3 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!searchParams.get("tab")) {
      const currentSearchParams = Object.fromEntries(searchParams.entries());
      setSearchParams({ ...currentSearchParams, tab: "1m" });
    }
  }, []);

  if (!data)
    return (
      <Empty>
        <EmptyTitle>No chart data available</EmptyTitle>
        <EmptyDescription>
          We couldn't load rate history for{" "}
          <span className="uppercase">
            {baseCurrency}/{targetCurrency}
          </span>{" "}
          right now. <br className="xl:block hidden" />
          This usually clears up in a minute.
        </EmptyDescription>
      </Empty>
    );

  return (
    <section className="flex flex-col gap-4 md:gap-5">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end">
        <ConversionStats change={data.change} growth={data.growth} growth_percentage={data.growth_percentage} last={data.last} open={data.open} />
        <HistoryRangeTab />
      </div>

      <RateHistoryChart last={data.last} chart_data={data.chart_data} />
    </section>
  );
}
