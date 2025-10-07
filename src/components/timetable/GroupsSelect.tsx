import type { CoursesAndTheirGroups } from "@/lib/types"
import { MultiSelect, type MultiSelectOption } from "../ui/multi-select"
import { useSettings, type SelectedGroups } from "@/context/UserSettingsContext"
import { useQuery } from "@tanstack/react-query"
import { fetchCoursesAndTheirGroups } from "@/lib/timetableUtils"
import { Button } from "../ui/button"
import { Loader2Icon } from "lucide-react"

type GroupsSelectProps = {
  selectedGroups: SelectedGroups
  setSelectedGroup: (courseId: string, selectedGroups: string[]) => void
}

function GroupsSelect({selectedGroups, setSelectedGroup}: GroupsSelectProps) {
  const { changeSettings } = useSettings()
  
  const { data: coursesAndGroups } = useQuery({
    queryFn: fetchCoursesAndTheirGroups,
    queryKey: ['coursesAndGroups']
  })

  function deselectAllGroups() {
    changeSettings({
      selectedGroups: {}
    })
  }

  async function selectAllGroups() {
    if(!coursesAndGroups) return
    const sg: SelectedGroups = {}
    for(const course of coursesAndGroups) 
      sg[course.course.id] = course.groups.map(c => c.id as unknown as string)

    changeSettings({
      selectedGroups: sg
    })
  }

  if(!coursesAndGroups)
    return (
      <div className="flex flex-1 justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    )

  return (
    <div className="flex flex-col gap-1.5">
      {
        coursesAndGroups.map((c) => <GroupSelect key={c.course.id}
          course={c} 
          selectedGroups={selectedGroups[c.course.id]}
          setSelectedGroups={(ids) => setSelectedGroup(c.course.id, ids)}  
        />)
      }
      <div className="flex flex-1 justify-end gap-2 pt-1">
        <Button onClick={selectAllGroups}>Select all</Button>
        <Button onClick={deselectAllGroups} variant="destructive">Unselect all</Button>
      </div>
    </div>
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
    <div>
      <h2>{course.course.course}</h2>
      <MultiSelect 
        maxCount={10}
        options={options}
        value={selectedCourses}
        defaultValue={selectedCourses}
        onValueChange={setSelectedCourses}
      />
    </div>
  )
}