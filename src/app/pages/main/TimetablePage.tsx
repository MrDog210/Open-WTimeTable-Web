import GroupsSelect from "@/components/timetable/GroupsSelect"
import Timetable from "@/components/timetable/Timetable"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useSettings } from "@/context/UserSettingsContext"
import { DONATION_LINK, GITHUB_ISSUE, GITHUB_REPO } from "@/lib/constants"
import { getSchoolYearDates, getWeekDates } from "@/lib/date"
import { fetchLecturesForGroups } from "@/lib/http/api"
import { exportDataToIcs, filterLecturesBySelectedGroups, getDistinctSelectedGroups, stringToFile } from "@/lib/timetableUtils"
import { getSchoolInfo } from "@/stores/schoolData"
import { useMutation } from "@tanstack/react-query"
import { Bug, Coffee, FileDown, Github, Loader2Icon, Settings } from "lucide-react"
import { useState } from "react"

const { schoolCode } = getSchoolInfo()

function TimetablePage() {
  const { selectedGroups, changeSelectedGroups } = useSettings()
  const [ settingsOpen, setSettingsOpen ] = useState(false)
  const [date, setDate] = useState(new Date())
  
  const exportDataMutaion = useMutation({
    mutationFn: async ({period}: {period: "week" | "all"}) => {
      let startDate, endDate
      if(period === "week") {
        const {from, till} = getWeekDates(date)
        startDate = from
        endDate = till
      } else {
        const d = getSchoolYearDates()
        startDate = d.startDate
        endDate = d.endDate
      }
      const distinctGroups = getDistinctSelectedGroups(selectedGroups) as unknown as number[]
      const lectures = filterLecturesBySelectedGroups((await fetchLecturesForGroups(schoolCode, distinctGroups.map(id => ({ id })), startDate, endDate)), selectedGroups)
      const stringData = exportDataToIcs(lectures).toString()
      stringToFile(stringData, "text/calendar", "wise-lectures.ics")
    }
  })

  return (
    <div>
      <div className="flex gap-2 m-5 mb-0">
        <Button variant="outline" onClick={() => setSettingsOpen(!settingsOpen)}>
          <Settings />
          Settings
        </Button>
        <Button variant="outline" disabled={exportDataMutaion.isPending} onClick={() => exportDataMutaion.mutateAsync({ period: 'week' })}>
          { exportDataMutaion.isPending ? <Loader2Icon className="animate-spin" /> : <FileDown />}
          Export week
        </Button>
        <Button variant="outline" disabled={exportDataMutaion.isPending} onClick={() => exportDataMutaion.mutateAsync({ period: 'all' })}>
          { exportDataMutaion.isPending ? <Loader2Icon className="animate-spin" /> : <FileDown />}
          Export semester
        </Button>
      </div>
      { settingsOpen && 
        <Card className="m-5 mb-0">
          <CardContent>
            <GroupsSelect selectedGroups={selectedGroups} setSelectedGroup={changeSelectedGroups} />
          </CardContent>
        </Card>}
      <Timetable date={date} setDate={setDate} />
      <div className="flex gap-5 justify-center m-5">
        <Button onClick={() => window.open(GITHUB_REPO, "_blank")} variant="ghost"><Github />View source code</Button>
        <Button onClick={() => window.open(GITHUB_ISSUE, "_blank")} variant="ghost"><Bug />Report an issue or suggest a feature</Button>
        <Button onClick={() => window.open(DONATION_LINK, "_blank")} variant="ghost"><Coffee />Support me</Button>
      </div>
    </div>
  )
}

export default TimetablePage