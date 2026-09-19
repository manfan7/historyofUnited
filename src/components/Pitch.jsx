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

function Avatar({ player, size, className }) {
  return (
    <div className={`avatar ${className ?? ""}`} style={{ width: size, height: size }}>
      <span>{initials(player.name)}</span>
      {player.photo && (
        <img
          src={player.photo}
          alt={player.name}
          loading="lazy"
          draggable={false}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
    </div>
  );
}

export default function Pitch({ slots, team, drag, celebrating, registerSlot, onCardDown, onRemove, seasonLabel }) {
  return (
    <div className={`pitch ${celebrating ? "wave" : ""}`} key={slots.map((s) => s.id).join("")}>
      <div className="pitch-inner">
        {/* markings */}
        <div className="mark center-circle" />
        <div className="mark center-line" />
        <div className="mark center-dot" />
        <div className="mark box box-top" />
        <div className="mark box box-bottom" />
        <div className="mark goal goal-top" />
        <div className="mark goal goal-bottom" />
        <div className="pitch-sheen" />
        <div className="pitch-badge">{seasonLabel}</div>

        {slots.map((s, i) => {
          const player = team[s.id];
          const isHover = drag?.hover === s.id;
          const match = player && player.pos === s.pos;
          return (
            <div
              key={s.id}
              ref={(el) => registerSlot(s.id, el)}
              className={[
                "slot",
                player ? "filled" : "empty",
                drag && !player ? "droppable" : "",
                drag && !player && drag.player.pos === s.pos ? "pos-match" : "",
                isHover ? "hover" : "",
              ].join(" ")}
              style={{ left: `${s.x}%`, top: `${s.y}%`, "--d": `${i * 40}ms`, "--i": i }}
            >
              {player ? (
                <div className={`pitch-card ${match ? "match" : "mismatch"}`}>
                  <button
                    className="card-remove"
                    title="Убрать с поля"
                    onClick={() => onRemove(s.id)}
                  >
                    ×
                  </button>
                  <div
                    className="card-grab"
                    onPointerDown={(e) => {
                      if (e.button !== 0) return;
                      e.preventDefault();
                      onCardDown(player, s.id, e);
                    }}
                  >
                    <Avatar player={player} size={62} />
                    <span className="card-pos" style={{ "--c": POS_COLORS[player.pos] }}>
                      {player.pos}
                    </span>
                    <span className="card-name">{player.name}</span>
                  </div>
                </div>
              ) : (
                <div className="slot-ghost">
                  <span className="slot-label">{s.label}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
