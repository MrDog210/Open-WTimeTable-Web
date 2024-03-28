import { useEffect, useState } from "react"
import Select from "react-select"

function CourseGroupSelectForm({course, groups}) {
  const [selectedGroups, setSelectedGroups] = useState([])

  useEffect(() => {
    groups.forEach(group => {
      group.selected = false
    })
    selectedGroups.forEach(group => {
      group.selected = true
    })
  }, [selectedGroups])

  return (
    <div>
      <label>{course.name}</label>
      <Select options={groups} getOptionLabel={opt => opt.name} getOptionValue={opt => opt.id} isMulti={true} onChange={setSelectedGroups}/>
    </div>
  )
}

export default CourseGroupSelectForm