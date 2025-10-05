import type { CoursesAndTheirGroups } from "@/lib/types"
import { MultiSelect, type MultiSelectOption } from "../ui/multi-select"
import { useMemo } from "react"

type GroupsSelectProps = {
  courses: CoursesAndTheirGroups[]
  setCourses: (courses: CoursesAndTheirGroups[]) => void
}

function GroupsSelect({courses, setCourses}: GroupsSelectProps) {

  return (
    <>
      {
        courses.map(({course, groups}) => ())
      }
    </>
  )
}

export default GroupsSelect

type GroupSelectProps = {
  course: CoursesAndTheirGroups
  selectedCourses: string[],
  setSelectedCourses: (ids: string[]) => void
}

function GroupSelect({course, selectedCourses, setSelectedCourses}: GroupSelectProps) {
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