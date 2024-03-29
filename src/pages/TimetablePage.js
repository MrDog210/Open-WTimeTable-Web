import { useState } from "react"
import { getStoredSchoolCode } from "../util/webStorage"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css";

function TimetablePage() {
  const [schoolCode] = useState(getStoredSchoolCode())
  const [lectures, setLectures] = useState([{
    start: moment().toDate(),
    end: moment()
      .add(3, "hours")
      .toDate(),
    title: "Some title"
  },
  {
    start: moment().toDate(),
    end: moment()
      .add(3, "hours")
      .toDate(),
    title: "Some title 2"
  }])
  const localizer = momentLocalizer(moment)
  return (
    <Calendar 
      localizer={localizer}
      events={lectures}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  )
}

export default TimetablePage