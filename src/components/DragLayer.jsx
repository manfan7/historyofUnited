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

export default function DragLayer({ drag }) {
  const { player, x, y, hover } = drag;
  return (
    <div className="drag-layer" style={{ left: x, top: y }}>
      <div className={`drag-card ${hover ? "will-drop" : ""}`}>
        <div className="avatar big">
          <span>{initials(player.name)}</span>
          {player.photo && (
            <img src={player.photo} alt="" draggable={false} />
          )}
        </div>
        <div className="drag-meta">
          <span className="drag-pos" style={{ "--c": POS_COLORS[player.pos] ?? "#888" }}>
            {player.pos}
          </span>
          <b>{player.name}</b>
          <small>{hover ? "отпусти, чтобы поставить" : "тяни на поле…"}</small>
        </div>
      </div>
    </div>
  );
}
