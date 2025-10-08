import type { MyEvent } from "@/lib/types"
import { Card } from "../ui/card"
import { getTimeFromDate } from "@/lib/date"
import { formatArray } from "@/lib/timetableUtils"

type TimetableEventProps = {
  event: MyEvent
}

function TimetableEvent({ event }: TimetableEventProps) {
  const { lecture } = event
  const { color, colorText, course, start_time, end_time, eventType, executionType, lecturers, rooms } = lecture
  const hexColor = (color === null || color === '') ? undefined : `#${color}`

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