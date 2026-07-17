export default function InfoCard({
  icon,
  iconColor,
  heading1,
  heading2,
}) {
  return (
    <article className="info-card">

      <div
        className="info-card-icon"
        style={{ backgroundColor: iconColor }}
      >
        {icon}
      </div>

      <h1 class="text-center font-bold text-2xl">{heading1}</h1>

      <p>{heading2}</p>

    </article>
  );
}