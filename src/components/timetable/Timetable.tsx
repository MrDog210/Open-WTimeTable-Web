import { Calendar, dayjsLocalizer, type Event } from 'react-big-calendar'
import { useState } from 'react'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useQuery } from '@tanstack/react-query'
import { useSettings } from '@/context/UserSettingsContext'
import stringHash from 'string-hash'

const localizer = dayjsLocalizer(dayjs)

function Timetable() {
  const { selectedGroups } = useSettings()
  const [date, setDate] = useState(new Date())
  const { data: events } = useQuery<Event[]>({
    initialData: [],
    queryFn: async () => {
      return [{
        title: 'test',
        start: dayjs().add(1, 'hour').toDate(),
        end: dayjs().subtract(1, 'hour').toDate()
      }]
    },
    queryKey: [ 'lectures', stringHash(JSON.stringify(selectedGroups)), date ]
  })

  return (
    <Calendar
      localizer={localizer}
      events={events}
      date={date}
      onNavigate={setDate}
      defaultView='work_week'
      views={["work_week", "day"]}
      className='h-screen'
      min={new Date(1972, 0, 1, 6, 0, 0, 0)}
      max={new Date(1972, 0, 1, 23, 0, 0, 0)}
    />
  )
}

export default Timetable