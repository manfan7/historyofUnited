import { useMemo } from "react";
import { POS_COLORS } from "../formations";

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function Sidebar({
  seasons,
  season,
  onSeason,
  players,
  filter,
  setFilter,
  query,
  setQuery,
  onRowDown,
  onRowClick,
  onPitch,
}) {
  const decades = useMemo(() => {
    const map = new Map();
    for (const s of seasons) {
      const dec = `${s.id.slice(0, 3)}0-е`;
      if (!map.has(dec)) map.set(dec, []);
      map.get(dec).push(s);
    }
    return [...map.entries()];
  }, [seasons]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return players
      .filter((p) => (filter === "ALL" ? true : p.pos === filter))
      .filter((p) => (q ? p.name.toLowerCase().includes(q) : true))
      .sort((a, b) => {
        const an = a.name.split(" ").pop();
        const bn = b.name.split(" ").pop();
        return an.localeCompare(bn, "ru");
      });
  }, [players, filter, query]);

  return (
    <aside className="sidebar">
      <div className="side-head">
        <label className="season-label">
          <span>Сезон</span>
          <select value={season.id} onChange={(e) => onSeason(e.target.value)}>
            {decades.map(([dec, group]) => (
              <optgroup key={dec} label={dec}>
                {group.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label} · {s.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <input
          className="search"
          type="search"
          placeholder="Поиск игрока…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="filters">
          {["ALL", "GK", "DF", "MF", "FW"].map((f) => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              data-pos={f}
              onClick={() => setFilter(f)}
            >
              {f === "ALL" ? "Все" : f}
            </button>
          ))}
        </div>
      </div>

      <div className="roster" key={season.id + filter}>
        {list.length === 0 && <p className="roster-empty">Никого не найдено</p>}
        {list.map((p, i) => {
          const used = onPitch.has(p.id);
          return (
            <div
              key={p.id}
              className={`roster-row ${used ? "used" : ""}`}
              style={{ "--d": `${Math.min(i * 16, 500)}ms` }}
              onPointerDown={(e) => {
                if (e.button !== 0) return;
                e.preventDefault();
                onRowDown(p, null, e);
              }}
              onClick={() => onRowClick(p)}
            >
              <div className="avatar small">
                <span>{initials(p.name)}</span>
                {p.photo && (
                  <img
                    src={p.photo}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
              </div>
              <div className="row-info">
                <b>{p.name}</b>
                <small>{p.country}</small>
              </div>
              {p.shirt && <span className="shirt">№{p.shirt}</span>}
              <span className="pos-chip" style={{ "--c": POS_COLORS[p.pos] ?? "#888" }}>
                {p.pos}
              </span>
              {used && <span className="used-mark">✔ на поле</span>}
            </div>
          );
        })}
      </div>
      <p className="side-foot">Клик — поставить на свободную позицию · перетащи — на любую</p>
    </aside>
  );
}
