import { useEffect, useState } from 'react'
import countriesService from '../services/countries'

const Country = ({ country }) => {
  const [weatherData, setWeatherData] = useState(null)
  
  useEffect(() => {
    countriesService.getWeatherData(country).then((data) => {
      setWeatherData(data)
      console.log(data);
    })
  }, [country])

  return (
    <div>
      <h1>{country.name}</h1>
      <div>Capital {country.capital}</div>
      <div>Area {country.area}</div>
      <h1>Languages</h1>
      <ul>  
        {
          country.languages.map(language => {
            return <li key={language}>{ language }</li>
          })
        }
      </ul>
      <img src={country.flag} alt="Flag" />
      <div>
        <h2>Weather in {country.capital}</h2>
          {weatherData ? (
            <div>
              <p>Temperature: {weatherData?.main?.temp} Celsius</p>
              <p>Wind: {weatherData?.wind?.speed} m/s</p> 
            </div>
          ) : (
            <p>Loading weather…</p>
          )}
      </div>
    </div>
  )
}

export default Country