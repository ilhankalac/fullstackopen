import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response)
      })
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchValue, setSearchValue] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value)
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(searchValue.toLowerCase())
  )

  const doesNameExist = (name) => {
    return persons.some(
      person => person.name.toLowerCase() === name.toLowerCase().trim()
    )
  }

  const addPerson = (event) => {
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

    personService.create(newPerson).then(responseData => {
      setPersons(persons.concat(responseData))
    })

    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter
        value={searchValue}
        onChange={handleSearchChange}
      />

      <h2>add a new</h2>

      <PersonForm
        onSubmit={addPerson}
        name={newName}
        number={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons persons={personsToShow} />
    </div>
  )
}

export default App