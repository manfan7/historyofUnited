import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import seasons from "./data/seasons.json";
import { FORMATIONS, POS_NAMES } from "./formations";
import Pitch from "./components/Pitch";
import Sidebar from "./components/Sidebar";
import DragLayer from "./components/DragLayer";
import Intro from "./components/Intro";
import Celebration from "./components/Celebration";
import stadium from "./assets/oldtrafford.jpg";

const STORE_KEY = "mu-lineup-v1";
const DRAG_THRESHOLD = 6;

function remapTeam(team, fromSlots, toSlots) {
  const next = {};
  for (const group of ["GK", "DF", "MF", "FW"]) {
    const players = fromSlots
      .filter((s) => s.pos === group && team[s.id])
      .map((s) => team[s.id]);
    toSlots
      .filter((s) => s.pos === group)
      .forEach((s, i) => {
        if (players[i]) next[s.id] = players[i];
      });
  }
  return next;
}

export default function App() {
  const [seasonId, setSeasonId] = useState(seasons[seasons.length - 1].id);
  const [formationId, setFormationId] = useState("4-4-2");
  const [team, setTeam] = useState({});
  const [drag, setDrag] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [intro, setIntro] = useState(true);
  const [celebrating, setCelebrating] = useState(false);

  const slotEls = useRef(new Map());
  const formation = FORMATIONS[formationId];
  const slots = formation.slots;

  const season = useMemo(
    () => seasons.find((s) => s.id === seasonId) ?? seasons[seasons.length - 1],
    [seasonId]
  );

  /* ---------- persistence ---------- */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      if (saved?.seasonId && seasons.some((s) => s.id === saved.seasonId)) {
        setSeasonId(saved.seasonId);
        if (FORMATIONS[saved.formationId]) setFormationId(saved.formationId);
        setTeam(saved.team ?? {});
      }
    } catch {
      /* ignore corrupt state */
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify({ seasonId, formationId, team }));
  }, [seasonId, formationId, team]);

  /* ---------- toast helper ---------- */
  const flash = useCallback((text) => {
    setToast(text);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  /* ---------- formation switch keeps players ---------- */
  const changeFormation = (nextId) => {
    setTeam((prev) => remapTeam(prev, slots, FORMATIONS[nextId].slots));
    setFormationId(nextId);
  };

  /* ---------- placement ---------- */
  const removeSlot = (slotId) =>
    setTeam((prev) => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });

  const autoPlace = (player) => {
    const empty = slots.find((s) => !team[s.id] && s.pos === player.pos);
    const slot = empty ?? slots.find((s) => !team[s.id]);
    if (!slot) {
      flash("Все позиции заняты — перетащите карточку на занятый слот, чтобы заменить");
      return;
    }
    assign(slot.id, player);
  };

  const assign = (slotId, player) =>
    setTeam((prev) => ({ ...prev, [slotId]: player }));

  const onPitchIds = useMemo(() => new Set(Object.values(team).map((p) => p.id)), [team]);

  /* ---------- drag & drop (pointer based) ---------- */
  const hitTest = (x, y) => {
    for (const [id, el] of slotEls.current) {
      const r = el.getBoundingClientRect();
      const pad = 14;
      if (x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad)
        return id;
    }
    return null;
  };

  const startDrag = (player, fromSlot, e) => {
    const origin = { x: e.clientX, y: e.clientY };
    let active = false;
    const move = (ev) => {
      if (!active) {
        if (Math.hypot(ev.clientX - origin.x, ev.clientY - origin.y) < DRAG_THRESHOLD) return;
        active = true;
      }
      setDrag({ player, fromSlot, x: ev.clientX, y: ev.clientY, hover: hitTest(ev.clientX, ev.clientY) });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      if (active) {
        setDrag((d) => {
          if (d?.hover) {
            const target = d.hover;
            setTeam((prev) => {
              const next = { ...prev };
              if (fromSlot) delete next[fromSlot];
              const victim = next[target];
              if (victim && fromSlot) next[fromSlot] = victim; // swap two pitch cards
              next[target] = d.player;
              return next;
            });
          } else if (fromSlot) {
            removeSlot(fromSlot); // dragged off the pitch
          }
          return null;
        });
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  /* ---------- random XI ---------- */
  const randomize = () => {
    const pool = [...season.players].sort(() => Math.random() - 0.5);
    setTeam({});
    const chosen = [];
    for (const s of slots) {
      const pick =
        pool.find((p) => p.pos === s.pos && !chosen.includes(p)) ??
        pool.find((p) => !chosen.includes(p));
      if (!pick) break;
      chosen.push(pick);
    }
    chosen.forEach((p, i) => {
      window.setTimeout(() => {
        setTeam((prev) => {
          const slot = slots.find((x) => !prev[x.id]);
          return slot ? { ...prev, [slot.id]: p } : prev;
        });
      }, i * 130);
    });
    flash("Случайная сборная собрана!");
  };

  const filled = Object.keys(team).length;

  /* ---------- intro / XI complete celebration ---------- */
  const finishIntro = useCallback(() => {
    setIntro(false);
  }, []);

  const prevFilled = useRef(0);
  useEffect(() => {
    if (filled === 11 && prevFilled.current < 11) {
      setCelebrating(true);
      const t = window.setTimeout(() => setCelebrating(false), 3400);
      prevFilled.current = filled;
      return () => clearTimeout(t);
    }
    prevFilled.current = filled;
  }, [filled]);

  return (
    <div className={`app ${drag ? "is-dragging" : ""} ${intro ? "behind-intro" : ""}`}>
      {intro && <Intro onDone={finishIntro} />}
      {celebrating && <Celebration />}
      <header className="topbar">
        <div className="brand">
          <div className="brand-stadium" title="Олд Траффорд">
            <img src={stadium} alt="Олд Траффорд" draggable={false} />
            <i className="stadium-sheen" />
          </div>
          <div>
            <h1>Легенды Юнайтед</h1>
            <p>Собери свою сборную из 141 сезона истории клуба · 1886–2027</p>
          </div>
        </div>
        <div className="topbar-actions">
          <div className="formation-switch">
            {Object.values(FORMATIONS).map((f) => (
              <button
                key={f.id}
                className={formationId === f.id ? "active" : ""}
                onClick={() => changeFormation(f.id)}
              >
                {f.id}
              </button>
            ))}
          </div>
          <button className="btn ghost" onClick={() => setTeam({})} disabled={!filled}>
            Очистить
          </button>
          <button className="btn primary" onClick={randomize}>
            🎲 Случайный состав
          </button>
        </div>
      </header>

      <main className="layout">
        <section className="pitch-wrap">
          <Pitch
            slots={slots}
            team={team}
            drag={drag}
            celebrating={celebrating}
            registerSlot={(id, el) => {
              if (el) slotEls.current.set(id, el);
              else slotEls.current.delete(id);
            }}
            onCardDown={startDrag}
            onRemove={removeSlot}
            seasonLabel={season.label}
          />
          <div className={`xi-status ${filled === 11 ? "complete" : ""}`}>
            <div className="xi-progress">
              <span style={{ width: `${(filled / 11) * 100}%` }} />
            </div>
            <span className="xi-count">{filled}/11</span>
            <span className="xi-label">
              {filled === 11 ? "СОСТАВ ГОТОВ ⚽" : "Перетащите игроков на поле"}
            </span>
          </div>
        </section>

        <Sidebar
          seasons={seasons}
          season={season}
          onSeason={setSeasonId}
          players={season.players}
          filter={filter}
          setFilter={setFilter}
          query={query}
          setQuery={setQuery}
          onRowDown={startDrag}
          onRowClick={autoPlace}
          onPitch={onPitchIds}
        />
      </main>

      {drag && <DragLayer drag={drag} />}

      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>

      <footer className="legend">
        {["GK", "DF", "MF", "FW"].map((pos) => (
          <span key={pos}>
            <i data-pos={pos} />
            {POS_NAMES[pos]}
          </span>
        ))}
        <em>данные: worldfootball.net · фото: hs-data.com</em>
      </footer>
    </div>
  );
}
