import React from "react";

interface MVAToggleProps {
  showMVA: boolean;
  setShowMVA: (show: boolean) => void;
}

const MVAToggle: React.FC<MVAToggleProps> = ({ showMVA, setShowMVA }) => {
  const toggleId = "mva-toggle";

  return (
    <div className="mva-toggle" role="group">
      <label className="switch" htmlFor={toggleId}>
        <input
          id={toggleId}
          type="checkbox"
          checked={showMVA}
          onChange={(e) => setShowMVA(e.target.checked)}
          aria-checked={showMVA}
          role="switch"
        />
        <span className="slider" aria-hidden="true"></span>
        <span className="toggle-label">Vis priser inkl. MVA</span>
      </label>
    </div>
  );
};

export default MVAToggle;
