import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';  // Import the CSS file

const App = () => {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  const api_key = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;  // Access the API key from environment variables

  useEffect(() => {
    if (query !== '') {
      axios
        .get(`https://restcountries.com/v3.1/all`)
        .then(response => {
          setCountries(response.data);
          const filtered = response.data.filter(country =>
            country.name.common.toLowerCase().includes(query.toLowerCase())
          );
          setFilteredCountries(filtered);
        });
    } else {
      setFilteredCountries([]);
    }
  }, [query]);

  useEffect(() => {
    if (selectedCountry) {
      const capital = selectedCountry.capital[0];
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
        .then(response => {
          setWeather(response.data);
        });
    }
  }, [selectedCountry, api_key]);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
    setSelectedCountry(null);  // Reset selected country when query changes
    setWeather(null);  // Reset weather when query changes
  };

  const handleShowClick = (country) => {
    setSelectedCountry(country);
  };

  return (
    <div>
      <h1>Find Countries</h1>
      <input value={query} onChange={handleQueryChange} placeholder="Type a country name" />
      {filteredCountries.length > 10 && <p>Too many matches, specify another filter</p>}
      {filteredCountries.length <= 10 && filteredCountries.length > 1 && (
        <ul>
          {filteredCountries.map(country => (
            <li key={country.cca3}>
              {country.name.common} <button onClick={() => handleShowClick(country)}>show</button>
            </li>
          ))}
        </ul>
      )}
      {filteredCountries.length === 1 && (
        <div>
          <h2>{filteredCountries[0].name.common}</h2>
          <p>Capital: {filteredCountries[0].capital}</p>
          <p>Population: {filteredCountries[0].population}</p>
          <img src={filteredCountries[0].flags.png} alt={`Flag of ${filteredCountries[0].name.common}`} width="100" />
          {weather && (
            <div>
              <h3>Weather in {filteredCountries[0].capital[0]}</h3>
              <p>Temperature: {weather.main.temp} °C</p>
              <p>Weather: {weather.weather[0].description}</p>
              <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="Weather icon" />
            </div>
          )}
        </div>
      )}
      {selectedCountry && (
        <div>
          <h2>{selectedCountry.name.common}</h2>
          <p>Capital: {selectedCountry.capital}</p>
          <p>Population: {selectedCountry.population}</p>
          <img src={selectedCountry.flags.png} alt={`Flag of ${selectedCountry.name.common}`} width="100" />
          {weather && (
            <div>
              <h3>Weather in {selectedCountry.capital[0]}</h3>
              <p>Temperature: {weather.main.temp} °C</p>
              <p>Weather: {weather.weather[0].description}</p>
              <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="Weather icon" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
