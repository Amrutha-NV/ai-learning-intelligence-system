import "./FlowCard.css";

export default function FlowCard({ icon, label, color }) {
  return (
    <div className="flow-card">
      <div
        className="flow-card-icon"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>

      <span className="flow-card-label">
        {label}
      </span>
    </div>
  );
}