import { fetchWeatherApi } from "openmeteo";

export async function getWeatherData(units = "metric", location) {
  try {
    const params = {
      latitude: location.latitude,
      longitude: location.longitude,
      daily: ["weather_code", "temperature_2m_max", "temperature_2m_min"],
      hourly: ["temperature_2m", "weather_code"],
      current: ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "weather_code", "precipitation", "wind_speed_10m"],
      timezone: "auto",
      ...(units === "imperial" && { temperature_unit: "fahrenheit", wind_speed_unit: "mph", precipitation_unit: "inch" }),
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    // const utcOffsetSeconds = response.utcOffsetSeconds();

    const current = response.current();
    const hourly = response.hourly();
    const daily = response.daily();

    // Note: The order of weather variables in the URL query and the indices below need to match
    const weatherData = {
      current: {
        time: new Date(Number(current.time()) * 1000),
        time_formatted: new Date(Number(current.time()) * 1000).toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        temperature: Math.round(current.variables(0).value()),
        humidity: Math.round(current.variables(1).value()),
        apparent_temperature: Math.round(current.variables(2).value()),
        weather_code: current.variables(3).value(),
        precipitation: Math.round(current.variables(4).value()),
        wind_speed: Math.round(current.variables(5).value()),
      },

      daily: {
        time: Array.from({ length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval() }, (_, i) =>
          new Date((Number(daily.time()) + i * daily.interval()) * 1000).toLocaleDateString("en-US", { weekday: "short" }),
        ),

        weather_code: daily.variables(0).valuesArray(),
        temperature_max: daily.variables(1).valuesArray().map(Math.round),
        temperature_min: daily.variables(2).valuesArray().map(Math.round),
      },

      hourly: {
        time: Array.from({ length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() }, (_, i) => new Date((Number(hourly.time()) + i * hourly.interval()) * 1000)),

        get currentHourIndex() {
          return this.time.findIndex((time) => time.getHours() === weatherData.current.time.getHours() && time.getDay() === weatherData.current.time.getDay());
        },

        get time_filtered() {
          return this.time.slice(this.currentHourIndex, this.currentHourIndex + 24).map((time) => time.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }));
        },

        temperature: hourly.variables(0).valuesArray().map(Math.round),

        get temp_filtered() {
          return this.temperature.slice(this.currentHourIndex, this.currentHourIndex + 24);
        },

        weather_code: hourly.variables(1).valuesArray(),

        get codes_filtered() {
          return this.weather_code.slice(this.currentHourIndex, this.currentHourIndex + 24);
        },
      },
    };

    return weatherData;
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    throw error;
  }
}
