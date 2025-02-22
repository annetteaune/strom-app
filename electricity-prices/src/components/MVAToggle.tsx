import React from "react";

interface MVAToggleProps {
  showMVA: boolean;
  setShowMVA: (show: boolean) => void;
}

const MVAToggle: React.FC<MVAToggleProps> = ({ showMVA, setShowMVA }) => {
  const toggleId = "mva-toggle";
  const toggleText = showMVA
    ? "Viser priser inkl. MVA"
    : "Viser priser eks. MVA";

  return (
    <div className="mva-toggle" role="group">
      <label className="switch" htmlFor={toggleId}>
        <span className="toggle-label">{toggleText}</span>
        <input
          id={toggleId}
          type="checkbox"
          checked={showMVA}
          onChange={(e) => setShowMVA(e.target.checked)}
          aria-checked={showMVA}
          role="switch"
        />
        <span className="slider" aria-hidden="true"></span>
      </label>
    </div>
  );
};

export default MVAToggle;
