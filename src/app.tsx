import Header from "./components/shared/header";
import LiveMarketCrawler from "./components/shared/live-markets-crawler";

export default function App() {
  return (
    <div className="bg-background text-lime-500">
      <Header />
      <LiveMarketCrawler />

      <main>
        <h1>Hello world</h1>
      </main>
    </div>
  );
}
