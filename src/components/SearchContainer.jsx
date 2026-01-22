import { useState, useEffect } from "react";
import { searchLocations } from "../services/geolocation";

export default function SearchContainer({ onSubmit }) {
  const [query, setQuery] = useState("");
  const [queryResults, setQueryResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCity, setSelectedCity] = useState({});

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
  }

  function handleSubmit(e) {
    e.preventDefault();
    setQuery("");
    onSubmit(selectedCity);
  }

  return (
    <form className="flex-flow align-center justify-center flex-wrap" role="search" onSubmit={handleSubmit}>
      <label htmlFor="search-bar" className="visually-hidden">
        Search Location
      </label>
      <input className="search-bar" type="search" name="search-bar" id="search-bar" value={query} onInput={handleInput} placeholder="Search for a place..." />
      <button className="button" type="submit">
        Search
      </button>
      {showDropdown && (
        <ul className="dropdown flow" role="list">
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
  );
}
