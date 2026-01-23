import { useState, useEffect, useRef } from "react";
import { searchLocations } from "../services/geolocation";

export default function SearchContainer({ onSubmit }) {
  const [query, setQuery] = useState("");
  const [queryResults, setQueryResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCity, setSelectedCity] = useState({});
  const [hasError, setHasError] = useState(false);
  const formRef = useRef(null);
  const submitButton = useRef(null);

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
    const value = e.target.value;
    setHasError(false);
    setQuery(value);
    if (value.length >= 3) {
      setShowDropdown(true);
    }
  }

  function handleClick(city) {
    setQuery(city.name);
    setSelectedCity(city);
    console.log("selected", selectedCity);
    setShowDropdown(false);
    setQueryResults([]);
    onSubmit(city);
    setQuery("");
  }

  function handleKeyDown(e, city) {
    console.log(e.key);
    if (e.key === "Enter") {
      setQuery(city.name);
      setSelectedCity(city);
      console.log("selected", selectedCity);
      setShowDropdown(false);
      setQueryResults([]);
      onSubmit(city);
      setQuery("");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (selectedCity.name) {
      setHasError(false);
      onSubmit(selectedCity);
      setQuery("");
      setSelectedCity({});
    } else {
      setHasError(true);
      console.log("Please select a city from the dropdown");
    }
  }

  return (
    <form ref={formRef} className="search-form " role="search" onSubmit={handleSubmit}>
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
  );
}
