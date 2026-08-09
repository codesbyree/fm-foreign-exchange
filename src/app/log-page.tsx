import { Empty, EmptyDescription, EmptyTitle } from "../components/ui/empty";

export default function LogPage() {
  return (
    <section>
      <Empty>
        <EmptyTitle>No conversions logged yet</EmptyTitle>
        <EmptyDescription>
          Every conversion is recorded here automatically when you tap LOG CONVERSION.
          <br className="xl:block hidden" /> Your log is private to this session and this browser.
        </EmptyDescription>
      </Empty>
    </section>
  );
}
