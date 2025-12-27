import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchValue, setSearchValue] = useState('')

  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchValue = (event) => {
    const value = event.target.value
    setSearchValue(value)
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(searchValue.toLowerCase())
  )


  const doesNameExist = (name) => {
    return persons.some(
      person => person.name.toLowerCase() === name.toLowerCase().trim()
    )
  }

  const saveNewName = (event) => {
    event.preventDefault()

    if (doesNameExist(newName)) {
      alert(`${newName} is already added to phonebook`)
      setNewName('')
      return
    }


    const newPerson = {
      id: persons.length + 1,
      name: newName.trim(),
      number: newNumber
    }

    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with
        <input
          value={searchValue}
          onChange={handleSearchValue}
        />
      </div>

      <h2>add a new</h2>
      <form onSubmit={saveNewName}>
        <div>
          name:
          <input
            value={newName}
            onChange={handleNewName}
          />
        </div>
        <div>
          number:
          <input
            value={newNumber}
            onChange={handleNewNumber}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      {personsToShow.map(person => 
        <div key={person.id}>{person.name} {person.number}</div>
      )}
    </div>
  )
}

export default App