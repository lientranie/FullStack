const Persons = ({personToShow, handleDelete}) => {
    return (
        <ul>
        {personToShow.map(person => (
            <li key = {person.id}>
                {person.name} {person.number}
                <button onClick={() => handleDelete(person.id, person.name)}>Delete</button>
            </li>
          ))
        }
        </ul>
    )
}

export default Persons