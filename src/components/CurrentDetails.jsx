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
    <div className="current__details grid-auto">
      {details.map((detail, index) => {
        return (
          <div key={index} className="detail flow bg-surface-400 br-md">
            <h3 className="clr-neutral-200 fw-medium fs-base">{detail.label}</h3>
            <p className="fs-xl fw-light">
              {detail.value} {detail.unit}
            </p>
          </div>
        );
      })}
    </div>
  );
}
