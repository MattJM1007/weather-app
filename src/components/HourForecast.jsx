export default function HourForcast({ time, icon, alt, temp }) {
  return (
    <div className="hourly__hour flex-flow align-center bg-surface-300 br-md">
      <img className="weather-icon" src={icon} alt={alt} />
      <p className="fs-md fw-medium">{time}</p>
      <span className="temp fw-medium">{temp}&deg;</span>
    </div>
  );
}
