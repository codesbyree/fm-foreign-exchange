import { Empty, EmptyDescription, EmptyTitle } from "../components/ui/empty";

export default function HistoryPage() {
  return (
    <section>
      <Empty>
        <EmptyTitle>No chart data available</EmptyTitle>
        <EmptyDescription>
          We couldn't load rate history for USD/EUR right now. <br className="xl:block hidden" />
          This usually clears up in a minute.
        </EmptyDescription>
      </Empty>
    </section>
  );
}
