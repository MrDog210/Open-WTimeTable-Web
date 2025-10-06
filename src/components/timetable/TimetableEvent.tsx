import type { MyEvent } from "@/lib/types"
import { Card, CardContent } from "../ui/card"
import { getTimeFromDate } from "@/lib/date"
import { formatArray } from "@/lib/timetableUtils"

type TimetableEventProps = {
  event: MyEvent
}

function TimetableEvent({ event }: TimetableEventProps) {
  const { lecture } = event
  const { branches, color, colorText, course, start_time, end_time, eventType, executionType, groups, lecturers, note, rooms, showLink } = lecture
  const hexColor = (color === null || color === '') ? undefined : `#${color}`

  return (
    <Card className="w-full h-full absolute left-0 top-0 p-1">
      <div className="flex flex-col">
        <div className="flex flex-1 justify-between">
          <div className="">{course}</div>
          <div>{executionType}</div>
        </div>
        <div>
          <div>{`${getTimeFromDate(start_time)} - ${getTimeFromDate(end_time)}`}</div>
          <div>{formatArray(rooms, 'name')}</div>
          <div>{formatArray(lecturers, 'name')}</div>
        </div>
        <div>
          { colorText && <div style={{alignSelf: 'end', color: hexColor}}>{colorText}</div>}
        </div>
      </div>
    </Card>
  )
}

export default TimetableEvent