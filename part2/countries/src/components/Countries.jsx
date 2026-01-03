const Countries = ({searchValue, countries, showSelected}) => {
  return (
    <div>
      {searchValue.length > 0 && countries.length < 10 &&
        countries.map(country => (
          <div key={country.id}>
            {country.name} <button onClick={()=>showSelected(country.id)}>Show</button>
          </div>
        ))
      }
      {searchValue.length > 0 && countries.length >= 10 && (
        <div>Too many matches, specify another filter</div>
      )}
    </div>
  )
}

export default Countries