import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

// Function to get all persons
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// Function to create a new person
const create = (newPerson) => {
  const request = axios.post(baseUrl, newPerson)
  return request.then(response => response.data)
}

// Function to update a person
const update = (id, updatedPerson) => {
  const request = axios.put(`${baseUrl}/${id}`, updatedPerson)
  return request.then(response => response.data)
}

// Function to delete a person
const removePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, update, removePerson }
