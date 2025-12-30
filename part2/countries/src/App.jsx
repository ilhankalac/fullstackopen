import { useEffect, useState } from "react"
import countriesService from "./services/countries"

const App = () => {
  const [searchValue, setSearchValue] = useState('')
  const [countries, setCountries] = useState([])

  const handleSearchInput = (event) => {
    setSearchValue(event.target.value)
  }

  const searchByCountryName = () => {
  }
  
  useEffect(() => {
    countriesService.getAll().then((data) => {
      const cleanData = data.map((country) => ({
        name: country.name?.official || '',
        capital: country.capital || [],
        area: country.area || 0,
        languages: country.languages || {}
      }))
      setCountries(countries.concat(cleanData))
    })

  }, [])

  return (
    <div>
      find countries <input value={searchValue} onChange={handleSearchInput} />
      <div>
        {
          countries.map(country => 
            <div key={country.name}>{country.name}</div>
          )
        }
      </div>
    </div>
  )
}

export default App