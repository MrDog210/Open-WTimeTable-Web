import { ModeToggle } from "@/components/mode-toggle"
import GroupsSelect from "@/components/timetable/GroupsSelect"
import Timetable from "@/components/timetable/Timetable"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useSettings } from "@/context/UserSettingsContext"
import { APP_PLAY_STORE, DONATION_LINK, GITHUB_ISSUE, GITHUB_REPO } from "@/lib/constants"
import { getSchoolYearDates, getWeekDates } from "@/lib/date"
import { fetchLecturesForGroups } from "@/lib/http/api"
import { exportDataToIcs, filterLecturesBySelectedGroups, getDistinctSelectedGroups, stringToFile } from "@/lib/timetableUtils"
import { getSchoolInfo } from "@/stores/schoolData"
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog"
import { useMutation } from "@tanstack/react-query"
import { BoxesIcon, Bug, Coffee, FileDown, Github, Loader2Icon, RotateCcw, SettingsIcon, Smartphone } from "lucide-react"
import { useState } from "react"

function TimetablePage() {
  const { schoolCode } = getSchoolInfo()
  const { selectedGroups, changeSelectedGroups, reset, compactDayView, changeSettings, scrollToCalendar } = useSettings()
  const [settingsOpen, setSettingsOpen] = useState(Object.keys(selectedGroups).length === 0 ? true : false)
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
      <div className="flex gap-2 m-5 mb-0 flex-wrap">
        <Button variant="outline" onClick={() => setSettingsOpen(!settingsOpen)}>
          <BoxesIcon />
          Change groups
        </Button>
        <Button variant="outline" disabled={exportDataMutaion.isPending} onClick={() => exportDataMutaion.mutateAsync({ period: 'week' })}>
          { exportDataMutaion.isPending ? <Loader2Icon className="animate-spin" /> : <FileDown />}
          Export week
        </Button>
        <Button variant="outline" disabled={exportDataMutaion.isPending} onClick={() => exportDataMutaion.mutateAsync({ period: 'all' })}>
          { exportDataMutaion.isPending ? <Loader2Icon className="animate-spin" /> : <FileDown />}
          Export semester
        </Button>
        <ModeToggle />
        <Dialog>
          <DialogTrigger>
            <Button variant="outline">
                <SettingsIcon />
                Settings
              </Button>
            </DialogTrigger>
             <DialogContent>
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
                <div className="flex items-center space-x-2">
                  <Switch checked={compactDayView} onCheckedChange={(checked) => {
                    changeSettings({
                      compactDayView: checked
                    })
                  }} id="compact-day-view" />
                  <Label htmlFor="compact-day-view">Compact day view</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={scrollToCalendar} onCheckedChange={(checked) => {
                    changeSettings({
                      scrollToCalendar: checked
                    })
                  }} id="compact-day-view" />
                  <Label htmlFor="compact-day-view">Scroll to timetable on load</Label>
                </div>
              </DialogHeader>
            </DialogContent>
        </Dialog>
        <div className="flex-1" />
        <Button variant={"destructive"} onClick={reset}>
          <RotateCcw />
          Reset
        </Button>
      </div>
      { settingsOpen && 
        <Card className="m-5 mb-0">
          <CardContent>
            <GroupsSelect selectedGroups={selectedGroups} setSelectedGroup={changeSelectedGroups} />
          </CardContent>
        </Card>}
      <Timetable date={date} setDate={setDate} />
      <div className="flex gap-5 justify-center m-5 flex-wrap">
        <Button onClick={() => window.open(APP_PLAY_STORE, "_blank")} variant="link"><Smartphone />Get android app</Button>
        <Button onClick={() => window.open(GITHUB_REPO, "_blank")} variant="link"><Github />View source code</Button>
        <Button onClick={() => window.open(GITHUB_ISSUE, "_blank")} variant="link"><Bug />Report an issue or suggest a feature</Button>
        <Button onClick={() => window.open(DONATION_LINK, "_blank")} variant="link"><Coffee />Support me</Button>
      </div>
    </div>
  )
}

export default TimetablePage