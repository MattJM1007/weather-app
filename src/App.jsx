import { useEffect, useState } from "react";
import { getWeatherData } from "./services/weatherData";
import { fetchLocation } from "./services/geolocation";
import { weatherCodes } from "./services/weatherCodes";
import weatherIcons from "./assets/images/weather-icons/weatherIcons";
import logo from "./assets/images/logo.svg";
import SearchContainer from "./components/SearchContainer";
import CurrentDetails from "./components/CurrentDetails";
import DayForcast from "./components/DayForcast";
import HourForcast from "./components/HourForcast";

function App() {
  const [units, setUnits] = useState("imperial");
  const [hours, setHours] = useState("12");
  const [data, setData] = useState(null);
  const [location, setLocation] = useState({
    name: null,
    latitude: null,
    longitude: null,
  });

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

  function handleSubmit(newLocation) {
    setLocation(newLocation);
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

  // console.log("Render - location:", location);
  console.log("Render - data:", data);

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
            <SearchContainer onSubmit={handleSubmit} />
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

            <CurrentDetails data={data.current} units={units} />
          </section>

          <section className="daily flow">
            <h2>Daily Forcast</h2>
            <div className="flex-flow">
              {data.daily.time.map((day, index) => {
                return (
                  //prettier-ignore
                  <DayForcast 
                  key={index} 
                  day={day} 
                  icon={getWeatherIcon(data.daily.weather_code[index])} 
                  tempMax={data.daily.temperature_max[index]} 
                  tempMin={data.daily.temperature_min[index]} />
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
                    //prettier-ignore
                    <HourForcast
                      key={index}
                      time={time}
                      icon={getWeatherIcon(data.hourly.codes_filtered[index])}
                      temp={data.hourly.temp_filtered[index]}
                    />
                  );
                })}
            </div>
          </section>
        </main>
      ) : (
        <main className="wrapper">
          <p>Loading weather data...</p>
        </main>
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
//7. DONE - set up search location feature
//8. DONE - show list of matching locations as user types
//    (need to get/save list of locations somehow - did something similar in JS30)
//9. DONE - check keys on mapped componenets
//10. style everything to be responsive and check accessibility
//11. add alt for icons
//12. error / loading states
