import type { CoursesAndTheirGroups } from "@/lib/types"
import { MultiSelect, type MultiSelectOption } from "../ui/multi-select"
import type { SelectedGroups } from "@/context/UserSettingsContext"

type GroupsSelectProps = {
  courses: CoursesAndTheirGroups[]
  selectedGroups: SelectedGroups
  setSelectedGroup: (courseId: string, selectedGroups: string[]) => void
}

function GroupsSelect({courses, selectedGroups, setSelectedGroup}: GroupsSelectProps) {

  return (
    <>
      {
        courses.map((c) => <GroupSelect key={c.course.id}
          course={c} 
          selectedGroups={selectedGroups[c.course.id]}
          setSelectedGroups={(ids) => setSelectedGroup(c.course.id, ids)}  
        />)
      }
    </>
  )
}

export default GroupsSelect

type GroupSelectProps = {
  course: CoursesAndTheirGroups
  selectedGroups: string[],
  setSelectedGroups: (ids: string[]) => void
}

function GroupSelect({course, selectedGroups: selectedCourses, setSelectedGroups: setSelectedCourses}: GroupSelectProps) {
  const options = course.groups.map((g): MultiSelectOption => ({
    label: g.name,
    value: g.id as unknown as string
  }))

  return (
    <>
      <h2>{course.course.course}</h2>
      <MultiSelect 
        options={options}
        value={selectedCourses}
        onValueChange={setSelectedCourses}
      />
    </>
  )
}