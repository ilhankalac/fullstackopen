import { useEffect, useState } from "react"
import countriesService from "./services/countries"
import Country from "./components/Country"
import Countries from './components/Countries'

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

  const showSelectedCountry = (id) => {
    const selectedCountry = countries.find(country => country.id === id)
    setCountries([selectedCountry])
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
        <Countries
          searchValue={searchValue}
          countries={countries}
          showSelected={showSelectedCountry}
        />
      )}
      {countries.length === 1 && (
        <Country country={countries[0]} />
      )}
    </div>
  )
}

export default App