import { Calendar, dayjsLocalizer, type Event } from 'react-big-calendar'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSettings } from '@/context/UserSettingsContext'
import stringHash from 'string-hash'
import { getWeekDates } from '@/lib/date'
import { fetchLecturesForGroups } from '@/lib/http/api'
import { getSchoolInfo } from '@/stores/schoolData'
import { filterLecturesBySelectedGroups, getDistinctSelectedGroups } from '@/lib/timetableUtils'
import type { LectureWise, MyEvent } from '@/lib/types'
import TimetableEvent from './TimetableEvent'
import "./Timetable.css"
import TimetableToolbar from './TimetableToolbar'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogHeader } from '../ui/dialog'
import LectureDialog from './LectureDIalog'

const localizer = dayjsLocalizer(dayjs)

type TimetableProps = {
  date: Date,
  setDate: (d: Date) => void
}

function Timetable({ date, setDate }: TimetableProps) {
  const { schoolCode } = getSchoolInfo()
  
  useEffect(() => {
    return syncScrolling()
  }, []);

  const { selectedGroups, defaultTimetableView, changeSettings } = useSettings()
  const {from, till} = getWeekDates(date)

  const [selectedLecture, setSelectedLecture] = useState<LectureWise | undefined>(undefined)
  const { data: events } = useQuery<MyEvent[]>({
    initialData: [],
    queryFn: async () => {
      const distinctGroups = getDistinctSelectedGroups(selectedGroups) as unknown as number[]
      return filterLecturesBySelectedGroups((await fetchLecturesForGroups(schoolCode, distinctGroups.map(id => ({ id })), from, till)), selectedGroups) 
        .map(lecture => ({
          lecture,
          start: new Date(lecture.start_time),
          end: new Date(lecture.end_time)
        }))
    },
    queryKey: [ 'lectures', stringHash(JSON.stringify(selectedGroups)), dayjs(from).format('DD/MM/YYYY'), dayjs(till).format('DD/MM/YYYY') ]
  })

  return (
    <>
      <Dialog open={!!selectedLecture} onOpenChange={() => setSelectedLecture(undefined)}>
        <LectureDialog lecture={selectedLecture} />
      </Dialog>
      <Calendar
        key={defaultTimetableView}
        localizer={localizer}
        events={events}
        date={date}
        onNavigate={setDate}
        defaultView={defaultTimetableView}
        onView={(v) => changeSettings({
          defaultTimetableView: v as any
        })}
        onSelectEvent={(event) => setSelectedLecture(event.lecture)}
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
          dateCellWrapper: () => <div className='hidden'></div>,
          toolbar: TimetableToolbar as any,
          //dayColumnWrapper: ({children}) => <div>{children}</div>

        }}
        eventPropGetter={() => ({
          style: {
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: 'none',
            padding: 0,
            color: 'inherit',
          },
        })}
        formats={{
          eventTimeRangeEndFormat: () => "",
          timeGutterFormat: (date) => dayjs(date).format("HH:mm"),
        }}
      />
    </>
  )
}

export default Timetable

function syncScrolling() {
  const s1 = document.getElementsByClassName('rbc-time-header')[0] as HTMLElement | undefined;
  const s2 = document.getElementsByClassName('rbc-time-content')[0] as HTMLElement | undefined;

  if (!s1 || !s2) return;

  const syncS1 = () => { s2.scrollTop = s1.scrollTop; };
  const syncS2 = () => { s1.scrollTop = s2.scrollTop; };

  s1.addEventListener('scroll', syncS1, false);
  s2.addEventListener('scroll', syncS2, false);

  return () => {
    s1.removeEventListener('scroll', syncS1, false);
    s2.removeEventListener('scroll', syncS2, false);
  };
}