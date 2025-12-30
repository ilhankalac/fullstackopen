import { useEffect, useState } from "react"
import countriesService from "./services/countries"

const App = () => {
  const [searchValue, setSearchValue] = useState('')

  const handleSearchInput = (event) => {
    setSearchValue(event.target.value)
  }
  
  useEffect(() => {
    countriesService.getAll().then((data) => {
      console.log(data);
    })
  }, [])
  return (
    <div>
      find countries <input value={searchValue} onChange={handleSearchInput}/>
    </div>
  )
}

export default App