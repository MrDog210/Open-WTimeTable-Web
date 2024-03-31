import { getTimeFromDate } from '../../util/dateUtils'
import { formatArray } from '../../util/timetableUtils'
import styles from './CalendarEvent.module.css'

function CalendarEvent({event}) {
  const {course, eventType, start_time, end_time, note, showLink, color, colorText, rooms, groups, lecturers, executionType} = event
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <div style={{ flex: 1, fontWeight: 'bold' }}>{course ? course : eventType}</div>
        <div>{executionType}</div>
      </div>
      <div>
        <div className={styles.smallText}>{`${getTimeFromDate(start_time)} - ${getTimeFromDate(end_time)}`}</div>
        <div>{formatArray(rooms, 'name')}</div>
        <div>{formatArray(lecturers, 'name')}</div>
      </div>
      <div>

      </div>
    </div>
  )
}

export default CalendarEvent