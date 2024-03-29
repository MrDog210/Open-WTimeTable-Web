import { useEffect, useState } from "react"
import { getSelectedProgramYearAndBranch, getStoredSchoolCode } from "../util/webStorage"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchGroupsForBranch, fetchLecturesForGroups } from "../util/http";
import { getWeekDates } from "../util/dateUtils";

function TimetablePage() {
  const [schoolCode] = useState(getStoredSchoolCode())
  const [lectures, setLectures] = useState([])
  const [date, setDate] = useState(new Date())
  
  useEffect(() => {
    async function refreshLectures() {
      const info = getSelectedProgramYearAndBranch()
      console.log(info)
      const allGroups = await fetchGroupsForBranch(schoolCode, info.branch.id)
      const {from, till} = getWeekDates(date)
      const data = await fetchLecturesForGroups(schoolCode, allGroups, from, till)
      data.forEach(lecture => {
        lecture.start_time = new Date(lecture.start_time)
        lecture.end_time = new Date(lecture.end_time)
      });
      console.log(data)
      setLectures(data)
    }
    refreshLectures()
  }, [date])
  
  const localizer = momentLocalizer(moment)
  return (
    <Calendar 
      localizer={localizer}
      events={lectures}
      startAccessor="start_time"
      endAccessor="end_time"
      defaultView="work_week"
      views={["work_week"]}
      style={{ height: 500 }}
    />
  )
}

export default TimetablePage