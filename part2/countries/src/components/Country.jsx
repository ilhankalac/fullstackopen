const Country = ({country}) => {
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
      <img src={country.flag } alt="Flag" />
    </div>
  )
}

export default Country