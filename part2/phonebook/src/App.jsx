import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

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
      name: newName.trim()
    }

    setPersons(persons.concat(newPerson))
    setNewName('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={saveNewName}>
        <div>
          name:
          <input
            value={newName}
            onChange={handleNewName}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      {persons.map(person => 
        <div key={person.name}>{person.name}</div>
      )}
    </div>
  )
}

export default App