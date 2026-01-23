import type { MyEvent } from "@/lib/types"
import { Card } from "../ui/card"
import { getTimeFromDate } from "@/lib/date"
import { formatArray } from "@/lib/timetableUtils"
import { useSettings } from "@/context/UserSettingsContext"

type TimetableEventProps = {
  event: MyEvent
}

function toAcronym(str: string): string {
  return str.trim().split(' ').map(word => word.length === 0 ? '' : word[0].toLocaleUpperCase()).join('')
}

function TimetableEvent({ event }: TimetableEventProps) {
  const { lecture } = event
  const { compactDayView, defaultTimetableView } = useSettings()
  const { color, colorText, course, start_time, end_time, eventType, executionType, lecturers, rooms } = lecture
  const hexColor = (color === null || color === '') ? undefined : `#${color}`

  if (compactDayView && defaultTimetableView === 'work_week') // compact view
    return (
      <Card className="w-full h-full absolute left-0 top-0 p-1 gap-y-0.5">
        <div className="font-bold text-lg leading-none">{course ? toAcronym(course) : toAcronym(eventType)}</div>
        <div>{executionType.length < 6 ? executionType : toAcronym(executionType)}</div>
        <div className="text-sm leading-none">{getTimeFromDate(start_time)}</div>
        <div className="text-sm leading-none">{getTimeFromDate(end_time)}</div>
        <div className="text-xs">{formatArray(rooms, 'name')}</div>
      </Card>
    )

  return (
    <Card className="w-full h-full absolute left-0 top-0 p-2">
      <div className="flex flex-col flex-1">
        <div className="flex">
          <div className="font-bold flex-1">{course ? course : eventType}</div>
          <div>{executionType}</div>
        </div>
        <div className="flex-1">
          <div className="text-sm">{`${getTimeFromDate(start_time)} - ${getTimeFromDate(end_time)}`}</div>
          <div>{formatArray(rooms, 'name')}</div>
          <div>{formatArray(lecturers, 'name')}</div>
        </div>
        { colorText && <div style={{alignSelf: 'end', color: hexColor}}>{colorText}</div>}
      </div>
    </Card>
  )
}

export default TimetableEvent