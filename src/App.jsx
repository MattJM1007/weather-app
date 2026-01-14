import { useEffect, useState } from "react";
import { getWeatherData } from "./services/weatherData";
import { getUserLocation, getLocationName } from "./services/geolocation";
import logo from "./assets/images/logo.svg";
import { weatherCodes } from "./services/weatherCodes";
import weatherIcons from "./assets/images/weather-icons/weatherIcons";

function App() {
  const [units, setUnits] = useState("imperial");

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    city: null,
    country: null,
  });

  const [data, setData] = useState(null);

  function updateUnits(e) {
    const newUnits = e.target.value;
    setUnits(newUnits);
  }

  function getWeatherIcon(code) {
    return weatherIcons[weatherCodes[code]];
  }

  useEffect(() => {
    async function fetchLocation() {
      try {
        const userLocation = await getUserLocation();
        const locationName = await getLocationName(userLocation.lat, userLocation.long);
        setLocation({
          latitude: userLocation.lat,
          longitude: userLocation.long,
          city: locationName.city,
          state: locationName.state,
          country: locationName.country,
        });
      } catch (error) {
        console.error("location error", error);
      }
    }

    fetchLocation();
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      const setWeatherData = async () => {
        setData(await getWeatherData(units, location));
      };
      setWeatherData();
    }
  }, [units, location]);

  console.log("Render - location:", location);
  console.log("Render - data:", data);

  return (
    <>
      <header className="flex-flow align-center">
        <img src={logo} alt="" />
        <label htmlFor="units-menu">Units:</label>
        <select name="units" id="units-menu" defaultValue="imperial" onInput={updateUnits}>
          <option value="">Units</option>
          <option value="imperial">Imperial</option>
          <option value="metric">Metric</option>
        </select>
      </header>

      {data ? (
        <main className="flow">
          <section className="hero">
            <h1>How's the sky looking today?</h1>
            <input type="search" name="" id="" />
            <button type="submit">Search</button>
          </section>

          <section className="current">
            <div className="current__main flex-flow align-center">
              <div className="location">
                <h2>{location.country.includes("United States") ? `${location.city}, ${location.state}` : `${location.city}, ${location.country}`}</h2>
                <p>
                  {data.current.time.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="temperature flex-flow">
                <img className="weather-icon" src={getWeatherIcon(data.current.weather_code)} alt="" />
                <span style={{ fontSize: "5rem" }}>{Math.round(data.current.temperature_2m)} &deg;</span>
              </div>
            </div>

            <div className="current__details flex-flow">
              <div className="feels-like">
                <p>Feels Like</p>
                <span>{Math.round(data.current.apparent_temperature)}&deg;</span>
              </div>
              <div className="humidity">
                <p>Humidity</p>
                <span>{Math.round(data.current.relative_humidity_2m)}%</span>
              </div>
              <div className="Wind">
                <p>Feels Like</p>
                <span>
                  {Math.round(data.current.relative_humidity_2m)} {units === "imperial" ? "mph" : "km/h"}
                </span>
              </div>
              <div className="precipitation">
                <p>Precipitation</p>
                <span>
                  {Math.round(data.current.precipitation)} {units === "imperial" ? "in" : "mm"}
                </span>
              </div>
            </div>
          </section>

          <section className="daily flow">
            <h2>Daily Forcast</h2>
            <div className="flex-flow">
              {data.daily.time.map((date, index) => {
                return (
                  <div className="daily__day grid-flow">
                    <p>{date.toLocaleDateString("en-US", { weekday: "short" })}</p>
                    <img className="weather-icon" src={getWeatherIcon(data.daily.weather_code[index])} alt="" />
                    <div className="flex-flow space-between">
                      <span>{Math.round(data.daily.temperature_2m_max[index])}&deg;</span>
                      <span>{Math.round(data.daily.temperature_2m_min[index])}&deg;</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="hourly">
            <header className="hourly__header flex-flow space-between">
              <h2>Hourly Forcast</h2>
              <label htmlFor="hourly-days" className="visually-hidden">
                Day of the week:
              </label>
              <select name="days" id="hourly-days" defaultValue="imperial" onInput={updateUnits}>
                {data.daily.time.map((date) => {
                  return <option value={date}>{date.toLocaleDateString("en-US", { weekday: "long" })}</option>;
                })}
              </select>
            </header>

            <div className="hourly__data">
              {(() => {
                // Find the current hour index
                const currentHourIndex = data.hourly.time.findIndex((time) => time.getHours() === data.current.time.getHours() && time.getDay() === data.current.time.getDay());

                // Get 8 hours starting from current hour
                return data.hourly.time.slice(currentHourIndex, currentHourIndex + 8).map((time, i) => {
                  const actualIndex = currentHourIndex + i;
                  return (
                    <div key={i} className="hourly__hour flex-flow align-center">
                      <img className="weather-icon" src={getWeatherIcon(data.hourly.weather_code[actualIndex])} alt="" />
                      <p>{time.toLocaleTimeString("en-US", { hour: "numeric", hour12: true })}</p>
                      <div className="flex-flow space-between">
                        <span>{Math.round(data.hourly.temperature_2m[actualIndex])}&deg;</span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </section>
        </main>
      ) : (
        <p>Loading data...</p>
      )}
    </>
  );
}

export default App;

//Project Plan:
//1. DONE - get weather data from api (see instructions for setup)
//2. DONE - get user location to load initial data (probably another api?)
//3. DONE - save api data in state variables (object for weather data)
//4. DONE-ish ~ load data into html elements
//5. DONE - setup functions to take units from dropdown menu
//6. setup functions to change hourly data based on selected day
//7. set up search location feature
//8. show list of matching locations as user types
//    (need to get/save list of locations somehow - did something similar in JS30)
//9. check keys on mapped componenets
//10. style everything to be responsive and check accessibility
