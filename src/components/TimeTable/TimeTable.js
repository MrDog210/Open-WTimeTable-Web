import { useEffect, useState } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css"
import { fetchLecturesForGroups } from "../../util/http";
import { getWeekDates } from "../../util/dateUtils";
import CalendarEvent from "../../components/TimeTable/CalendarEvent";
import { getLastTimetableView, setLastTimetableView } from "../../util/webStorage";

function TimeTable({schoolCode, groups, onLectureClicked}) {
  const [lectures, setLectures] = useState([])
  const [date, setDate] = useState(new Date())
  const [isFetching, setIsFetching] = useState(false)
  
  useEffect(() => {
    async function refreshLectures() {
      if(!schoolCode || !groups || groups.length == 0) return
      setIsFetching(true)
      try{
        const {from, till} = getWeekDates(date)
        const data = await fetchLecturesForGroups(schoolCode, groups, from, till)
        data.forEach(lecture => {
          lecture.start_time = new Date(lecture.start_time)
          lecture.end_time = new Date(lecture.end_time)
        });
        console.log(data)
        setLectures(data)
      } catch (e) {
        window.alert(e)
      }
      setIsFetching(false)
    }
    refreshLectures()
  }, [date, groups, schoolCode])

  function onViewChanged(view) {
    setLastTimetableView(view)
  }

  let lastView = getLastTimetableView()
  if(lastView === null || lastView === undefined)
    lastView = "work_week"

  const localizer = momentLocalizer(moment)
  return (
    <Calendar style={{ cursor: isFetching ? 'progress' : undefined}}
      localizer={localizer}
      events={lectures}
      components={{event: CalendarEvent}}
      onSelectEvent={(lecture) => { onLectureClicked(lecture) }}
      startAccessor="start_time"
      endAccessor="end_time"
      defaultView={lastView}
      views={["work_week", "day"]}
      onView={onViewChanged}
      timeslots={1}
      step={60}
      date={date}
      selectable={false}
      onNavigate={setDate}
      scrollToTime={true}
      formats={{
        eventTimeRangeFormat: () => "",
        timeGutterFormat: (date) => moment(date).format("HH:mm"),
        //dateFormat
      }}
      min={new Date(1972, 0, 1, 6, 0, 0, 0)}
      max={new Date(1972, 0, 1, 23, 0, 0, 0)}
    />
  )
}

export default TimeTable