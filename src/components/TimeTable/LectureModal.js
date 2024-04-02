import IonIcon from "@reacticons/ionicons";
import { useEffect } from "react";
import Modal from "react-responsive-modal"
import "react-responsive-modal/styles.css";
import classes from "./LectureModal.module.css"

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
      aria-labelledby="my-modal-title"
    >
      <h2>{course}</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
        pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet
        hendrerit risus, sed porttitor quam.
      </p>
    </Modal>
  )
}

export default LectureModal