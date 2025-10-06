import { Calendar, dayjsLocalizer, type Event } from 'react-big-calendar'
import { useState } from 'react'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useQuery } from '@tanstack/react-query'
import { useSettings } from '@/context/UserSettingsContext'
import stringHash from 'string-hash'
import { getWeekDates } from '@/lib/date'
import { fetchLecturesForGroups } from '@/lib/http/api'
import { getSchoolInfo } from '@/stores/schoolData'
import { getDistinctSelectedGroups } from '@/lib/timetableUtils'
import type { MyEvent } from '@/lib/types'
import TimetableEvent from './TimetableEvent'
import "./Timetable.module.css"

const { schoolCode } = getSchoolInfo()
const localizer = dayjsLocalizer(dayjs)

function Timetable() {
  const { selectedGroups, defaultTimetableView, changeSettings } = useSettings()
  const [date, setDate] = useState(new Date())
  const {from, till} = getWeekDates(date)
  const { data: events } = useQuery<MyEvent[]>({
    initialData: [],
    queryFn: async () => {
      const distinctGroups = getDistinctSelectedGroups(selectedGroups) as unknown as number[]
      return (await fetchLecturesForGroups(schoolCode, distinctGroups.map(id => ({ id })), from, till))
        .filter(({groups, courseId, course}) => {
          for(const group of groups)
            if(course === '' || selectedGroups[courseId] && selectedGroups[courseId].includes(group.id))
              return true
          return false
        })
        .map(lecture => ({
          lecture,
          start: new Date(lecture.start_time),
          end: new Date(lecture.end_time)
        }))
    },
    queryKey: [ 'lectures', stringHash(JSON.stringify(selectedGroups)), dayjs(from).format('DD/MM/YYYY'), dayjs(till).format('DD/MM/YYYY') ]
  })
const eventWrapper = (props) => {
   return <div ref={node => {
      const eventEl = node?.querySelector(".rbc-event");
      // Do whatever you want with the actual .rbc-event div   
      }}>
       {props.children} 
    </div>
}
  return (
    <Calendar
      key={defaultTimetableView}
      localizer={localizer}
      events={events}
      date={date}
      onNavigate={setDate}
      defaultView={defaultTimetableView}
      onView={(v) => changeSettings({
        defaultTimetableView: v as unknown as any
      })}
      views={["work_week", "day"]}
      className='h-screen'
      min={new Date(1972, 0, 1, 6, 0, 0, 0)}
      max={new Date(1972, 0, 1, 23, 0, 0, 0)}
      timeslots={1}
      step={60}
      selectable={false}

      components={{
        event: TimetableEvent,
        //eventWrapper: ({children, style}) => <div style={style}>{children}</div>
      }}
      eventPropGetter={(event) => ({
        style: {
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
          padding: 0,
          color: 'inherit',
        },
      })}
    />
  )
}

export default Timetable