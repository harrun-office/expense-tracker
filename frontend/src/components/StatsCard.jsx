const StatsCard = ({ label, value, helper }) => (
  <div className="card stats-card">
    <p className="stats-card__label">{label}</p>
    <p className="stats-card__value">{value}</p>
    {helper && <p className="stats-card__helper">{helper}</p>}
  </div>
);

export default StatsCard;

