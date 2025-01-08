import DarkModeToggle from "./DarkModeToggle";
import MVAToggle from "../MVAToggle";

interface HeaderProps {
  showMVA: boolean;
  setShowMVA: (show: boolean) => void;
}

export default function Header({ showMVA, setShowMVA }: HeaderProps) {
  return (
    <header>
      <div className="header-content">
        <h1>Dagens strømpriser</h1>
        <div className="header-controls">
          <MVAToggle showMVA={showMVA} setShowMVA={setShowMVA} />
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
