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
import UnitsIcon from "./assets/images/ui-icons/icon-units.svg";

function App() {
  const [units, setUnits] = useState("imperial");
  const [hours, setHours] = useState("8");
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
      <header className="wrapper flex-flow align-center space-between flex-wrap">
        <img className="margin-center" src={logo} alt="" />
        <div className="flex-flow margin-center">
          <label htmlFor="units-menu" className="visually-hidden">
            Choose Units
          </label>
          <select className="dropdown flex-flow align-center" name="units" id="units-menu" onInput={updateUnits}>
            <button>
              <selectedcontent></selectedcontent>
            </button>
            <option value=""> Units</option>
            <option value="imperial">Imperial</option>
            <option value="metric">Metric</option>
          </select>
        </div>
      </header>

      {data ? (
        <main className="wrapper flow-lg">
          <h1 className="main-title margin-block-xl text-center">How's the sky looking today?</h1>

          <section className="search-container">
            <SearchContainer onSubmit={handleSubmit} />
          </section>

          <section className="current flow span-2">
            <div className="current__main flex-flow align-center br-lg">
              <div className="location flow">
                <h2 className="fs-lg">{location.name}</h2>
                <p className="clr-neutral-200">{data.current.time_formatted}</p>
              </div>
              <div className="temperature flex-flow align-center">
                <img className="weather-icon-lg" src={getWeatherIcon(data.current.weather_code)} alt={weatherCodes[data.current.weather_code]} />
                <span className="fs-3xl">{data.current.temperature}&deg;</span>
              </div>
            </div>

            <CurrentDetails data={data.current} units={units} />
          </section>

          <section className="daily flow">
            <h2 className="fs-md fw-semi-bold">Daily Forcast</h2>
            <div className="grid-auto">
              {data.daily.time.map((day, index) => {
                return (
                  //prettier-ignore
                  <DayForcast 
                  key={index} 
                  day={day} 
                  icon={getWeatherIcon(data.daily.weather_code[index])} 
                  alt={weatherCodes[data.daily.weather_code[index]]}
                  tempMax={data.daily.temperature_max[index]} 
                  tempMin={data.daily.temperature_min[index]} />
                );
              })}
            </div>
          </section>

          <section className="hourly flow bg-surface-400 br-lg">
            <header className="hourly__header flex-flow align-center">
              <h2 className="fs-md fw-semi-bold">Hourly Forcast</h2>

              <label htmlFor="hourly-hours" className="visually-hidden">
                Choose number of hours
              </label>
              <select className="dropdown" name="hours" id="hourly-hours" defaultValue="8" onInput={updateHours}>
                <button>
                  <selectedcontent></selectedcontent>
                </button>
                <option value="8">8 hours</option>
                <option value="12">12 hours</option>
                <option value="24">24 hours</option>
              </select>
            </header>

            <div className="hourly__data grid-flow" tabIndex={hours === "8" ? "-1" : "0"}>
              {data.hourly.time_filtered
                .filter((_, index) => index < hours)
                .map((time, index) => {
                  return (
                    //prettier-ignore
                    <HourForcast
                      key={index}
                      time={time}
                      icon={getWeatherIcon(data.hourly.codes_filtered[index])}
                      alt={weatherCodes[data.hourly.codes_filtered[index]]}
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
//10. DONE - style everything to be responsive
//11. DONE - check accessibility - add alt for icons / tab into search dropdown
//12. error / loading states
