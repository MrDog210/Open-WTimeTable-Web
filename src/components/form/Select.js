
function Select({title, values, schema = {id: 'id', name: 'name'}}) {
  if(!values)
    return
  console.log("got: " + values)
  return (
    <select>
      { values.map(value => 
        <option key={value[schema.id]} id={value[schema.id]}>{value[schema.name]}</option>
      ) }
    </select>
  )
}

export default Select