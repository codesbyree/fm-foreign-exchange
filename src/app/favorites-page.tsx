import { Empty, EmptyDescription, EmptyTitle } from "../components/ui/empty";

export default function FavoritesPage() {
  return (
    <section>
      <Empty>
        <EmptyTitle>No pinned pairs yet</EmptyTitle>
        <EmptyDescription>
          Pin a pair to track its rate here.
          <br className="xl:block hidden" /> Tap the star icon on any conversion or comparison row.
        </EmptyDescription>
      </Empty>
    </section>
  );
}
