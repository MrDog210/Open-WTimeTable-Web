import GroupsSelect from "@/components/timetable/GroupsSelect"
import Timetable from "@/components/timetable/Timetable"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useSettings } from "@/context/UserSettingsContext"
import { FileDown, Settings } from "lucide-react"
import { useState } from "react"

function TimetablePage() {
  const { selectedGroups, changeSelectedGroups } = useSettings()
  const [ settingsOpen, setSettingsOpen ] = useState(false)

  return (
    <div>
      <Button variant="outline" onClick={() => setSettingsOpen(!settingsOpen)}>
        <Settings />
        Settings unbutton ga maniac!
      </Button>
      <Button>
        <FileDown />
        Export
      </Button>
      { settingsOpen && 
        <Card className="m-5 mb-0">
          <CardContent>
            <GroupsSelect selectedGroups={selectedGroups} setSelectedGroup={changeSelectedGroups} />
          </CardContent>
        </Card>}
      <Timetable />
    </div>
  )
}

export default TimetablePage