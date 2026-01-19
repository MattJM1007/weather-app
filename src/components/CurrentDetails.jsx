export default function CurrentDetails({ data, units }) {
  const details = [
    {
      label: "Feels Like",
      value: data.apparent_temperature,
      unit: "°",
    },
    {
      label: "Humidity",
      value: data.humidity,
      unit: "%",
    },
    {
      label: "Wind Speed",
      value: data.wind_speed,
      unit: units === "imperial" ? " mph" : " km/h",
    },
    {
      label: "Precipitation",
      value: data.precipitation,
      unit: units === "imperial" ? " in" : " mm",
    },
  ];

  return (
    <div className="current__details flex-flow space-between">
      {details.map((detail, index) => {
        return (
          <div key={index} className="current-detail">
            <h3>{detail.label}</h3>
            <span>
              {detail.value} {detail.unit}
            </span>
          </div>
        );
      })}
    </div>
  );
}
