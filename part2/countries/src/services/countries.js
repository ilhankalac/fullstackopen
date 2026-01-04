import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/'

const getAll = () => {
  const request = axios.get(baseUrl+ 'all')
  return request.then(response => response.data)
}

const getWeatherData = (country) => {
  const request = axios.get('https://api.openweathermap.org/data/2.5/weather', {
    params: {
      lat: country.lat,
      lon: country.lon,
      exclude: 'minutely,alerts',
      units: 'metric',
      appid: import.meta.env.VITE_SOME_KEY
    }
  })
  return request.then(response => response.data)
}

export default { getAll, getWeatherData }