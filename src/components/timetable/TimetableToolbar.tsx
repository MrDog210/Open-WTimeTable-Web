import type { ToolbarProps } from "react-big-calendar"
import { ButtonGroup } from "../ui/button-group"
import { Button } from "../ui/button"

interface TimetableToolbarProps extends Omit<ToolbarProps, "views"> {
  views: string[]
}

function TimetableToolbar({ label, onNavigate, onView, view}: TimetableToolbarProps) {

  return (
    <div className="flex justify-between items-center p-5 flex-col sm:flex-row gap-2 pt-2.5">
      <ButtonGroup>
        <Button onClick={() => onNavigate("PREV")} variant="outline">Previous</Button>
        <Button onClick={() => onNavigate("TODAY")} variant="outline">Today</Button>
        <Button onClick={() => onNavigate("NEXT")} variant="outline">Next</Button>
      </ButtonGroup>
      <div className="flex items-center font-bold">
        {label}
      </div>
      <ButtonGroup>
        <Button variant={view === "work_week" ? "default" : "outline"} onClick={() => onView("work_week")}>Week</Button>
        <Button variant={view === "day" ? "default" : "outline"} onClick={() => onView("day")}>Day</Button>
      </ButtonGroup>
    </div>
  )
}

export default TimetableToolbar