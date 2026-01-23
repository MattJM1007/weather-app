# Frontend Mentor - Weather app solution

This is a solution to the [Weather app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/weather-app-K1FhddVm49). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- Search for weather information by entering a location in the search bar
- View current weather conditions including temperature, weather icon, and location details
- See additional weather metrics like "feels like" temperature, humidity percentage, wind speed, and precipitation amounts
- Browse a 7-day weather forecast with daily high/low temperatures and weather icons
- View an hourly forecast showing temperature changes throughout the day
- Switch between different days of the week using the day selector in the hourly forecast section
- Toggle between Imperial and Metric measurement units via the units dropdown
- Switch between specific temperature units (Celsius and Fahrenheit) and measurement units for wind speed (km/h and mph) and precipitation (millimeters) via the units dropdown
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page

### Screenshot

![](./screenshot.png)

### Links

- Solution URL: [Code](https://github.com/MattJM1007/weather-app)
- Live Site URL: [Click me](https://mattjm1007.github.io/weather-app/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- [React](https://reactjs.org/) - JS library

### What I learned

#### React useEffect

This was my first big react project. I learned to use useEffect in multiple locations to handle rendering when the state variables changed. Notably when the location changed from the user searching:

```js
useEffect(() => {
  if (location.latitude && location.longitude) {
    const setWeatherData = async () => {
      try {
        setError(false);
        const weatherData = await getWeatherData(units, location);
        setData(weatherData);
      } catch (err) {
        console.error("Failed to fetch weather data", err);
        setError(true);
        setData(null);
      }
    };
    setWeatherData();
  }
}, [units, location]);
```

#### Accessibility

I also learned more about accessibility to make the custom search dropdown keyboard accessibile. I also learned about a new aria role "listbox", which is useful for search. Also adding the tab index 0 to each li made them tabable.

```js
<form className="search-form " role="search" onSubmit={handleSubmit}>
  <div className="flex-flow align-center justify-center flex-wrap">
    <label htmlFor="search-bar" className="visually-hidden">
      Search Location
    </label>
    <input className="search-bar" type="search" name="search-bar" id="search-bar" value={query} onInput={handleInput} placeholder="Search for a place..." />
    {showDropdown && queryResults.length > 0 && (
      <ul className="dropdown flow" role="listbox" aria-label="search results">
        {queryResults.map((result, index) => {
          return (
            //prettier-ignore
            <li
                key={index}
                role="option"
                tabIndex="0"
                onClick={() => handleClick(result)}
                onKeyDown={(e) => handleKeyDown(e, result)}>
                  {result.name}
                </li>
          );
        })}
      </ul>
    )}
    <button ref={submitButton} className="button" type="submit">
      Search
    </button>
  </div>
  {hasError && (
    <p className="error text-center" aria-live="polite">
      Please select a city from the dropdown
    </p>
  )}
</form>
```

#### Handling API data

I also learned to use a getter function to cleanup the hourly data to get just the data I needed to load

```js
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
```

### Continued development

I would like to better impliment the loading and error states. I think they are not 100% the best they could be, although I did include them. I would also like to keep learning how to better handle data more efficiently.

### Useful resources

- [MDN Listbox role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/listbox_role) - info abou the listbox role

## Author

- Frontend Mentor - [@MattJM1007](https://www.frontendmentor.io/profile/MattJM1007)
