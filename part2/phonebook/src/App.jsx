import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    personsService.getAll().then(response => {
      setPersons(response)
    })
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [notification, setNotification] = useState(null)

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
      if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const currentPerson = { ...persons.find(person => person.name === newName), number: newNumber }
        personsService.update(currentPerson.id, currentPerson).then(responseData => {
          setPersons(
            persons.map(person =>
              person.id !== responseData.id ? person : responseData
            )
          )
        
          setNewName('')
          setNewNumber('')

          setNotification({
            message: 'Updated ' + currentPerson.name,
            type: 'success'
          })
          setTimeout(() => {
            setNotification(null)
          }, 5000);

        }).catch(() => {
          setNotification(
            {
              message: `Information of '${currentPerson.name}' has been already removed from server`,
              type: 'error'
            }
          )
          setTimeout(() => {
            setNotification(null)
          }, 5000)
          setPersons(persons.filter(n => n.id !== currentPerson.id))
        })
      }
      return
    }

    const highestId = persons.find(person => Number(person.id) === Math.max(...persons.map(p => Number(p.id))))?.id || 0
    const newPerson = {
      id: (Number(highestId) + 1).toString(),
      name: newName.trim(),
      number: newNumber
    }

    personsService.create(newPerson).then(responseData => {
      setPersons(persons.concat(responseData))
      setNewName('')
      setNewNumber('')
      setNotification({
        message: 'Added ' + newPerson.name,
        type: 'success'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000);
    })
  }

  const onDeletePerson = (id) => {
    if(confirm(`Delete ${persons.find(person => person.id === id)?.name}?`)) {
      personsService.deleteObj(id).then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
    }
  }
  return (
    <div>
      <h2>Phonebook</h2>

      {notification && (
        <Notification notification={notification} />
      )}

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

      <Persons
        persons={personsToShow}
        onDeletePerson={onDeletePerson}
      />
    </div>
  )
}

export default App