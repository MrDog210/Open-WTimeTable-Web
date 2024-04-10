import IonIcon from "@reacticons/ionicons";
import { useEffect } from "react";
import Modal from "react-responsive-modal"
import "react-responsive-modal/styles.css";
import classes from "./LectureModal.module.css"
import { formatArray } from "../../util/wiseUtils";
import ContentCard from "./ContentCard";
import { getTimeFromDate } from "../../util/dateUtils";

function LectureModal({modalVisible, lecture, onClose}) {
  if(!lecture)
    return

  const {course, eventType, start_time, end_time, note, showLink, color, colorText, rooms, groups, lecturers, executionType, executionType_id} = lecture

  return (
    <Modal open={modalVisible} onClose={onClose} center 
      closeIcon={<IonIcon name="close" size="large" />}
      classNames={{
        overlay: classes.overlay,
        modal: classes.modal
      }}
      blockScroll={false}
    >
      <h2 className={classes.title}>{course ? course : eventType}</h2>
      <hr />
      <div>
        <div className={classes.subtitle}>
          <span>{`${getTimeFromDate(start_time)} - ${getTimeFromDate(end_time)}`}</span>
          {executionType && <span>{executionType}</span>}
        </div>
        <ContentCard title="Rooms:" content={formatArray(rooms, 'name')} />
        <ContentCard title='Groups:' content={formatArray(groups, 'name')} />
        <ContentCard title='Lecturers:' content={formatArray(lecturers, 'name')} />
        <ContentCard title='Note:' content={note} />
        <ContentCard title='Show link:' content={showLink} />
        <ContentCard title='Color text:' content={colorText} />
        <div></div>
      </div>
    </Modal>
  )
}

export default LectureModal