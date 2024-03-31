import { useEffect, useState } from "react"
import { getSelectedGroups } from "../../util/webStorage"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css"
import { fetchLecturesForGroups } from "../../util/http";
import { getWeekDates } from "../../util/dateUtils";
import CalendarEvent from "../../components/TimeTable/CalendarEvent";

function TimeTable({schoolCode, groups}) {
  const [lectures, setLectures] = useState([])
  const [date, setDate] = useState(new Date())
  
  useEffect(() => {
    async function refreshLectures() {
      if(!schoolCode || !groups || groups.length == 0) return
      const {from, till} = getWeekDates(date)
      const data = await fetchLecturesForGroups(schoolCode, groups, from, till)
      data.forEach(lecture => {
        lecture.start_time = new Date(lecture.start_time)
        lecture.end_time = new Date(lecture.end_time)
      });
      console.log(data)
      setLectures(data)
    }
    refreshLectures()
  }, [date, groups])

  const localizer = momentLocalizer(moment)
  return (
    <Calendar 
      localizer={localizer}
      events={lectures}
      components={{event: CalendarEvent}}
      onSelectEvent={(e) => {console.log(e)}}
      startAccessor="start_time"
      endAccessor="end_time"
      defaultView="work_week"
      views={["work_week"]}
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