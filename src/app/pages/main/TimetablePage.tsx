import GroupsSelect from "@/components/timetable/GroupsSelect"
import Timetable from "@/components/timetable/Timetable"
import { useSettings } from "@/context/UserSettingsContext"
import { fetchCoursesAndTheirGroups } from "@/lib/timetableUtils"
import { useQuery } from "@tanstack/react-query"

function TimetablePage() {
  const { selectedGroups, changeSelectedGroups } = useSettings()

  const { data: coursesAndGroups } = useQuery({
    queryFn: fetchCoursesAndTheirGroups,
    queryKey: ['coursesAndGroups']
  })
  return (
    <div>
      { coursesAndGroups && <GroupsSelect courses={coursesAndGroups} selectedGroups={selectedGroups} setSelectedGroup={changeSelectedGroups} />}
      <Timetable />
    </div>
  )
}

export default TimetablePage