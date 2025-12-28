const Persons = ({ persons, onDeletePerson }) => {
  return (
    <>
      {persons.map(person =>
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={() => onDeletePerson(person.id)}>
            delete
          </button>
        </div>
      )}
    </>
  )
}

export default Persons