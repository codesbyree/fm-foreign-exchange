import { useEffect, useRef } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { useSearchParams } from "react-router";
import { createChart, AreaSeries, ColorType, LineStyle, type Time } from "lightweight-charts";
import moment from "moment-timezone";

import type { RateHistoryData } from "../../../types/app.types";
import { cn } from "../../../utils/style.utils";

type Props = HTMLMotionProps<"div"> & Omit<RateHistoryData, "open" | "change" | "growth" | "growth_percentage">;

export default function RateHistoryChart(props: Props) {
  const { className, last, chart_data } = props;

  const [searchParams] = useSearchParams();
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const baseCurrency = searchParams.get("base") ?? "usd";
  const targetCurrency = searchParams.get("quote") ?? "idr";

  const userTimeZone = moment.tz.guess();
  const formattedDate = moment().tz(userTimeZone).format("MMM DD HH:MM z");

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#e5e5e5", // text-neutral-200
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
      },
      grid: {
        vertLines: {
          visible: false, // Hiding vertical lines to match the design
        },
        horzLines: {
          color: "rgba(229, 229, 229, 0.05)", // Very faint neutral-200
          style: LineStyle.Dashed,
        },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
    });

    const series = chart.addSeries(AreaSeries, {
      lineColor: "#84cc16", // tailwind lime-500
      topColor: "rgba(132, 204, 22, 0.4)", // lime-500 with opacity
      bottomColor: "rgba(132, 204, 22, 0)", // transparent
      lineWidth: 2,
    });

    const formattedData = chart_data.map((item) => ({
      time: item.time as Time,
      value: item.value,
    }));

    series.setData(formattedData);
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [chart_data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className={cn("px-3 py-4 bg-neutral-700 border border-neutral-600 rounded-2xl md:p-5 flex flex-col gap-5", className)}
    >
      <div className="flex items-center justify-between">
        <p className="uppercase text-neutral-50 text-base tracking-widest">
          {baseCurrency}/{targetCurrency}
        </p>

        <p className="uppercase text-xs text-neutral-200 tracking-widest">
          {last} · {formattedDate}
        </p>
      </div>

      <div ref={chartContainerRef} className="w-full" />
    </motion.div>
  );
}
