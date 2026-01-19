export default function HourForcast({ time, icon, temp }) {
  return (
    <div className="hourly__hour flex-flow align-center">
      <img className="weather-icon" src={icon} alt="" />
      <p>{time}</p>
      <div className="flex-flow space-between">
        <span>{temp}&deg;</span>
      </div>
    </div>
  );
}
