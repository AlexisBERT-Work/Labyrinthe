import React, { useEffect, useRef } from "react";

const Tuile = ({ cell, estRevele, estJoueur, onClick, estAdjacent }) => {
  const refTuile = useRef(null);

  useEffect(() => {
    if (estRevele) {
      spawnParticles();
    }
  }, [estRevele]);

  const spawnParticles = () => {
    const container = refTuile.current;
    if (!container) return;

    for (let i = 0; i < 10; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      container.appendChild(p);

      const angle = Math.random() * Math.PI * 2;
      const distance = 15 + Math.random() * 15;

      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      p.style.setProperty("--x", `${x}px`);
      p.style.setProperty("--y", `${y}px`);

      setTimeout(() => p.remove(), 350);
    }
  };

  const COLORS = {
    wall: "bg-gray-900",
    start: "bg-green-600",
    exit: "bg-blue-600",
    monster: "bg-red-700",
    key: "bg-yellow-300 text-gray-900",
    danger: "bg-purple-600",
    obstacle: "bg-orange-500",
    item: "bg-cyan-400 text-gray-900",
    empty: "bg-gray-800",
  };

  const getTuileRevelee = () => {
    let style = `${COLORS.empty} text-white`;
    let content = "";

    if (cell === "S") { style = COLORS.start + " text-white"; content = "S"; }
    else if (cell === "E") { style = COLORS.exit + " text-white"; content = "E"; }
    else if (cell === "W") { style = COLORS.wall; }
    else if (cell.startsWith("M:")) { style = COLORS.monster; content = "M"; }
    else if (cell.startsWith("K:")) { style = COLORS.key; content = "K"; }
    else if (cell.startsWith("D:")) { style = COLORS.danger; content = "D"; }
    else if (cell.startsWith("O:")) { style = COLORS.obstacle; content = "O"; }
    else if (cell.startsWith("I:")) { style = COLORS.item; content = "I"; }

    return (
      <div className={`w-full h-full rounded-md border border-gray-700 text-xl font-bold flex items-center justify-center relative ${style} backface-hidden`}>
        {!estJoueur && content}
        {estJoueur && (
          <div className="absolute inset-0 flex items-center justify-center z-10 animate-pop">
            <div className="w-9 h-9 rounded-full bg-yellow-400 shadow-md flex items-center justify-center">
              🧍
            </div>
          </div>
        )}
      </div>
    );
  };

  const getTuileCachee = () => {
    const hoverStyles = estAdjacent
      ? "hover:bg-gray-500 hover:border-yellow-400 hover:scale-[1.03] animate-pulse-soft"
      : "opacity-40";

    return (
      <div className={`w-full h-full rounded-md border border-gray-700 flex items-center justify-center text-2xl font-bold bg-gray-700 text-gray-500 ${hoverStyles} backface-hidden`}>
        ?
      </div>
    );
  };

  return (
    <div ref={refTuile} className={`aspect-square relative select-none transform-style-preserve-3d transition-transform duration-500 ${estRevele ? "rotate-y-180" : ""}`} onClick={() => estAdjacent && !estRevele && onClick()}>
      <div className="absolute inset-0 rotate-y-0">
        {!estRevele && getTuileCachee()}
      </div>
      <div className="absolute inset-0 rotate-y-180">
        {estRevele && getTuileRevelee()}
      </div>
    </div>
  );
};

export default Tuile;