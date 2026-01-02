import { useEffect, useState } from "react"
import countriesService from "./services/countries"
import Country from "./components/Country"

const App = () => {
  const [searchValue, setSearchValue] = useState('')
  const [countries, setCountries] = useState([])
  const [allCountries, setAllCountries] = useState([])

  const handleSearchInput = (event) => {
    const value = event.target.value
    setSearchValue(value)
    searchCountries(value)
  }

  const searchCountries = (value) => {
    const q = value.toLowerCase()
    const results = allCountries.filter(country =>
      country.name.toLowerCase().includes(q)
    )
    setCountries(results)
  }

  useEffect(() => {
    countriesService.getAll().then((data) => {
      const cleanData = data.map((country) => ({
        name: country?.name?.common || '',
        capital: country.capital || [],
        area: country.area || 0,
        languages: Object.values(country?.languages || {}).map(String),
        id: country.cca3,
        flag: country.flags.png
      }))
      setCountries(cleanData)
      setAllCountries(cleanData)
    })
  }, [])

  return (
    <div>
      find countries <input value={searchValue} onChange={handleSearchInput} />
      {countries.length > 1 && (
        <div>
          {searchValue.length > 0 && countries.length < 10 &&
            countries.map(country => (
              <div key={country.id}>
                {country.name}
              </div>
            ))
          }
          {searchValue.length > 0 && countries.length >= 10 && (
            <div>Too many matches, specify another filter</div>
          )}
        </div>
      )}
      {countries.length === 1 && (
        <Country country={countries[0]} />
      )}
    </div>
  )
}

export default App