import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setSearchTerm] = useState('')
  const [notification, setNotification] = useState({ message: null, type: '' })

  // Fetch data from the JSON server
  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
  
    const existingPerson = persons.find(person => person.name === newName)
  
    if (existingPerson) {
      // Ask for confirmation to update the number
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber }
  
        // PUT request to update the person
        personsService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            // Update the frontend with the new number
            setPersons(persons.map(person => 
              person.id !== existingPerson.id ? person : returnedPerson
            ))
            setNewName('')
            setNewNumber('')
  
            // Success notification for updating a number
            setNotification({ message: `Updated ${newName}'s number`, type: 'success' })
            setTimeout(() => setNotification({ message: null, type: '' }), 5000)
          })
          .catch(error => {
            if (error.response && error.response.status === 404) {
              // Show a specific error if the person no longer exists
              setNotification({
                message: `Information of ${newName} has already been removed from the server`,
                type: 'error'
              })
            } else {
              // Handle other errors
              setNotification({
                message: `Failed to update ${newName}. Please try again.`,
                type: 'error'
              })
            }
            setTimeout(() => setNotification({ message: null, type: '' }), 5000)
          })
      }
    } else {
      // If the person doesn't exist, create a new one
      const personObject = {
        name: newName,
        number: newNumber,
      }
  
      personsService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
  
          // Success notification for adding a person
          setNotification({ message: `Added ${newName}`, type: 'success' })
          setTimeout(() => setNotification({ message: null, type: '' }), 5000)
        })
        .catch(error => {
          setNotification({ message: `Failed to add ${newName}. ${error.message}`, type: 'error' })
          setTimeout(() => setNotification({ message: null, type: '' }), 5000)
        })
    }
  }
  

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  // delete a person from the phonebook
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService
        .removePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))

          // success notification for deleting a person
          setNotification({ message: `Deleted ${name}`, type: 'success' })
          setTimeout(() => setNotification({ message: null, type: '' }), 5000)
        })
        .catch(error => {
          setNotification({ message: `The person ${name} was already deleted from the server`, type: 'error' })
          setTimeout(() => setNotification({ message: null, type: '' }), 5000)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const personToShow = newSearch
    ? persons.filter(person =>
        person.name.toLowerCase().includes(newSearch.toLowerCase())
      )
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter searchQuery={newSearch} handleSearchChange={handleSearchChange} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons 
        personToShow={personToShow}
        handleDelete={handleDelete}
      />
      <div>debug: {newName}</div> {/* Useful for debugging */}
    </div>
  )
}

export default App
