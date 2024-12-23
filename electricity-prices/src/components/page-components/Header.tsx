import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
  return (
    <header>
      <div className="header-content">
        <h1>Dagens strømpriser</h1>
        <DarkModeToggle />
      </div>
    </header>
  );
}
