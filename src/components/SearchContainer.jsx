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

  function handleSubmit(e) {
    e.preventDefault();
    setQuery("");
    onSubmit(selectedCity);
  }

  return (
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
  );
}
