import { useEffect, useState } from "react";
import crest from "../assets/crest.svg";

export default function Intro({ onDone }) {
  const [phase, setPhase] = useState(0); // 0 crest sweep, 1 hold, 2 exit

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase(1), 1500);
    const t2 = window.setTimeout(() => setPhase(2), 2100);
    const t3 = window.setTimeout(() => onDone(), 2900);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className={`intro phase-${phase}`} onClick={() => onDone()}>
      <div className="intro-sky">
        <div className="intro-sun" />
        <div className="intro-stars">
          {Array.from({ length: 26 }).map((_, i) => (
            <i key={i} style={{ "--x": `${(i * 37) % 100}%`, "--y": `${(i * 53) % 60}%`, "--d": `${(i % 7) * 300}ms` }} />
          ))}
        </div>
      </div>
      <div className="intro-grid" />
      <img className="intro-crest" src={crest} alt="Эмблема Манчестер Юнайтед" draggable={false} />
      <div className="intro-word">Манчестер Юнайтед</div>
      <div className="intro-sub">1878 · Легенды на поле</div>
    </div>
  );
}
