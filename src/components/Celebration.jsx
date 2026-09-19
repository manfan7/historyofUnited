import { useMemo } from "react";

const COLORS = ["#e8402a", "#f2b950", "#ff4fa3", "#45e0d0", "#ff9645", "#f6e7c9"];

export default function Celebration() {
  const confetti = useMemo(
    () =>
      Array.from({ length: 46 }).map((_, i) => ({
        left: `${(i * 41 + 13) % 100}%`,
        delay: `${((i * 173) % 1800) / 1000}s`,
        dur: `${2.2 + ((i * 97) % 130) / 100}s`,
        size: 6 + ((i * 29) % 7),
        color: COLORS[i % COLORS.length],
        rot: `${(i * 67) % 360}deg`,
      })),
    []
  );

  return (
    <div className="celebration" onClick={(e) => e.stopPropagation()}>
      <div className="cele-sun" />
      <div className="cele-beams" />
      <h2 className="cele-title">СОСТАВ ГОТОВ</h2>
      <p className="cele-sub">XI легенд собран · во славу Юнайтед</p>
      <div className="cele-confetti">
        {confetti.map((c, i) => (
          <span key={i} style={c} />
        ))}
      </div>
    </div>
  );
}
