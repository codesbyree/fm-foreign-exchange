import Logo from "../../assets/logo.svg";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 md:px-6 md:py-5">
      <a href="/">
        <img src={Logo} alt="" aria-hidden="true" className="h-5 md:h-6.5" />
        <span className="sr-only">Homepage</span>
      </a>

      <div className="flex items-center gap-2 md:gap-4 text-neutral-200 uppercase text-2xs md:text-sm tracking-tight">
        <p>55 Currencies</p>
        <span className="w-0.5 h-0.5 rounded-full bg-neutral-200" />
        <p>EOD</p>
        <span className="w-0.5 h-0.5 rounded-full bg-neutral-200" />
        <p>ECB Data</p>
      </div>
    </header>
  );
}
