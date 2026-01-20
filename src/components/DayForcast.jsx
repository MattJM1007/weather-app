export default function DayForcast({ day, icon, tempMax, tempMin }) {
  return (
    <div className="daily__day grid-flow bg-surface-400 text-center br-md">
      <p>{day}</p>
      <img className="weather-icon" src={icon} alt="" />
      <div className="flex-flow space-around">
        <span>{tempMax}&deg;</span>
        <span>{tempMin}&deg;</span>
      </div>
    </div>
  );
}
