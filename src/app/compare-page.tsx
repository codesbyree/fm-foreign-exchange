import { Empty, EmptyDescription, EmptyTitle } from "../components/ui/empty";

export default function ComparePage() {
  return (
    <section>
      <Empty>
        <EmptyTitle>No comparison available</EmptyTitle>
        <EmptyDescription className="xl:max-w-md mx-auto">Enter an amount in SEND above to see what your money is worth in other currencies.</EmptyDescription>
      </Empty>
    </section>
  );
}
