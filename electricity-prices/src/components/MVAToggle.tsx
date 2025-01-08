import React from "react";

interface MVAToggleProps {
  showMVA: boolean;
  setShowMVA: (show: boolean) => void;
}

const MVAToggle: React.FC<MVAToggleProps> = ({ showMVA, setShowMVA }) => {
  return (
    <div className="mva-toggle">
      <label className="switch">
        <input
          type="checkbox"
          checked={showMVA}
          onChange={(e) => setShowMVA(e.target.checked)}
        />
        <span className="slider"></span>
      </label>
      <span className="toggle-label">Vis priser inkl. MVA</span>
    </div>
  );
};

export default MVAToggle;
