import { Outlet } from "react-router";

import Header from "../shared/header";
import LiveMarketCrawler from "../shared/live-markets-crawler";
import { TabMenu, TabMenuItem } from "../shared/tab-menu";
import FavoriteRatesChip from "../shared/favorites/favorite-rates-chip";
import LoggedRatesChip from "../shared/conversion-log/logged-rates-chip";
import Converter from "../shared/converter/converter";

export default function MainLayout() {
  return (
    <div className="bg-background no-scrollbar h-dvh overflow-auto">
      <Header />
      <LiveMarketCrawler />

      <main className="mx-auto max-w-275 px-4 py-8 md:py-6 md:px-12 xl:px-8 xl:py-12 flex flex-col gap-10 xl:gap-8">
        <div className="space-y-4">
          <h1 className="uppercase text-neutral-50 text-xl leading-6 tracking-tight">Check the rate</h1>
          <Converter />
        </div>

        <div className="space-y-4 md:space-y-5">
          <TabMenu initial="/history">
            <TabMenuItem href="/history">history</TabMenuItem>
            <TabMenuItem href="/compare">Compare</TabMenuItem>
            <TabMenuItem href="/favorites">
              Favorites
              <FavoriteRatesChip />
            </TabMenuItem>
            <TabMenuItem href="/log">
              Log
              <LoggedRatesChip />
            </TabMenuItem>
          </TabMenu>

          <Outlet />
        </div>
      </main>
    </div>
  );
}
