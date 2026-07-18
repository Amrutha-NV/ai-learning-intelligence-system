import "./TopicBadge.css";

export default function TopicBadge({
  name,
  delay
}) {
  return (
    <div
      className="topic-badge"
      style={{
        animationDelay: `${delay}s`
      }}
    >
      {name}
    </div>
  );
}