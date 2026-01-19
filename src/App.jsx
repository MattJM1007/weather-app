import { useEffect, useState } from "react";
import { getWeatherData } from "./services/weatherData";
import { fetchLocation, searchLocations } from "./services/geolocation";
import { weatherCodes } from "./services/weatherCodes";
import weatherIcons from "./assets/images/weather-icons/weatherIcons";
import logo from "./assets/images/logo.svg";

function App() {
  const [units, setUnits] = useState("imperial");
  const [hours, setHours] = useState("12");
  const [data, setData] = useState(null);
  const [location, setLocation] = useState({
    name: null,
    latitude: null,
    longitude: null,
  });
  const [query, setQuery] = useState("");
  const [queryResults, setQueryResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCity, setSelectedCity] = useState({});

  function updateUnits(e) {
    const newUnits = e.target.value;
    setUnits(newUnits);
  }

  function updateHours(e) {
    const newValue = e.target.value;
    setHours(newValue);
  }

  function getWeatherIcon(code) {
    return weatherIcons[weatherCodes[code]];
  }

  useEffect(() => {
    const getLocationData = async () => {
      setLocation(await fetchLocation());
    };
    getLocationData();
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      const setWeatherData = async () => {
        setData(await getWeatherData(units, location));
      };
      setWeatherData();
    }
  }, [units, location]);

  function handleSubmit(e) {
    e.preventDefault();
    //set location
    setQuery("");
    setLocation(selectedCity);
  }

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 3 && showDropdown) {
        const cities = await searchLocations(query);
        setQueryResults(cities);
      } else {
        setQueryResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, showDropdown]);

  async function handleInput(e) {
    setQuery(e.target.value);
    setShowDropdown(true);
  }

  function handleClick(city) {
    setQuery(city.name);
    setSelectedCity(city);
    console.log("selected", selectedCity);
    setShowDropdown(false);
    setQueryResults([]);
  }

  // console.log("Render - location:", location);
  // console.log("Render - data:", data);

  return (
    <>
      <header className="wrapper flex-flow align-center space-between">
        <img src={logo} alt="" />
        <div className="flex-flow">
          <label htmlFor="units-menu" className="visually-hidden">
            Choose Units
          </label>
          <select name="units" id="units-menu" onInput={updateUnits}>
            <option value="">Units</option>
            <option value="imperial">Imperial</option>
            <option value="metric">Metric</option>
          </select>
        </div>
      </header>

      {data ? (
        <main className="wrapper flow">
          <section className="hero">
            <h1>How's the sky looking today?</h1>
            <form role="search" onSubmit={handleSubmit}>
              <label htmlFor="search-bar" className="visually-hidden">
                Search Location
              </label>
              <input type="search" name="search-bar" id="search-bar" value={query} onInput={handleInput} />
              <button type="submit">Search</button>
              {showDropdown && (
                <ul className="dropdown">
                  {queryResults.map((result, index) => {
                    return (
                      <li key={index} onClick={() => handleClick(result)}>
                        {result.name}
                      </li>
                    );
                  })}
                </ul>
              )}
            </form>
          </section>

          <section className="current">
            <div className="current__main flex-flow align-center">
              <div className="location">
                <h2>{location.name}</h2>
                <p>{data.current.time_formatted}</p>
              </div>
              <div className="temperature flex-flow">
                <img className="weather-icon-lg" src={getWeatherIcon(data.current.weather_code)} alt="" />
                <span style={{ fontSize: "5rem" }}>{data.current.temperature} &deg;</span>
              </div>
            </div>

            <div className="current__details flex-flow space-between">
              <div className="feels-like">
                <p>Feels Like</p>
                <span>{data.current.apparent_temperature}&deg;</span>
              </div>
              <div className="humidity">
                <p>Humidity</p>
                <span>{data.current.humidity}%</span>
              </div>
              <div className="Wind">
                <p>Wind Speed</p>
                <span>
                  {data.current.wind_speed} {units === "imperial" ? "mph" : "km/h"}
                </span>
              </div>
              <div className="precipitation">
                <p>Precipitation</p>
                <span>
                  {data.current.precipitation} {units === "imperial" ? "in" : "mm"}
                </span>
              </div>
            </div>
          </section>

          <section className="daily flow">
            <h2>Daily Forcast</h2>
            <div className="flex-flow">
              {data.daily.time.map((day, index) => {
                return (
                  <div key={index} className="daily__day grid-flow">
                    <p>{day}</p>
                    <img className="weather-icon" src={getWeatherIcon(data.daily.weather_code[index])} alt="" />
                    <div className="flex-flow space-between">
                      <span>{data.daily.temperature_max[index]}&deg;</span>
                      <span>{data.daily.temperature_min[index]}&deg;</span>
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
                Choose number of hours
              </label>
              <select name="days" id="hourly-days" defaultValue="8" onInput={updateHours}>
                <option value="8">8 hours</option>
                <option value="12">12 hours</option>
                <option value="24">24 hours</option>
              </select>
            </header>

            <div className="hourly__data">
              {data.hourly.time_filtered
                .filter((_, index) => index < hours)
                .map((time, index) => {
                  return (
                    <div key={index} className="hourly__hour flex-flow align-center">
                      <img className="weather-icon" src={getWeatherIcon(data.hourly.codes_filtered[index])} alt="" />
                      <p>{time}</p>
                      <div className="flex-flow space-between">
                        <span>{data.hourly.temp_filtered[index]}&deg;</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        </main>
      ) : (
        <p>Loading weather data...</p>
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
//6. DONE - setup functions to change hourly data based on day - changed to 12/24 hr display
//7. set up search location feature
//8. show list of matching locations as user types
//    (need to get/save list of locations somehow - did something similar in JS30)
//9. DONE - check keys on mapped componenets
//10. style everything to be responsive and check accessibility
