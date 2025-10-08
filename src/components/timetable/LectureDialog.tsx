import type { LectureWise } from '@/lib/types'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogHeader } from '../ui/dialog'
import { Separator } from '../ui/separator'
import { formatArray } from '@/lib/timetableUtils'
import { getTimeFromDate } from '@/lib/date'

type LectureDialogLineProps = {
  title: string,
  content: string
}

function LectureDialogLine({ title, content }: LectureDialogLineProps) {
  if(!content || content === "") return

  return (
    <div>
      <span>
        {title} 
      </span>
      <span>
        {content}
      </span>
    </div>
  )
}

type LectureDialogProps = {
  lecture: LectureWise | undefined
}

function LectureDialog({ lecture }: LectureDialogProps) {
  if(!lecture)
    return <></>
  
  const { branches, color, colorText, course, start_time, end_time, eventType, executionType, groups, lecturers, note, rooms, showLink } = lecture ?? {}
  
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className='font-bold'>{course ? `${course} - ${executionType}` : eventType}</DialogTitle>
      </DialogHeader>
      <Separator />
      <div>
        <div>{`${getTimeFromDate(start_time)} - ${getTimeFromDate(end_time)}`}</div>
        <LectureDialogLine title="Rooms: " content={formatArray(rooms, 'name')} />
        <LectureDialogLine title='Groups: ' content={formatArray(groups, 'name')} />
        <LectureDialogLine title='Lecturers: ' content={formatArray(lecturers, 'name')} />
        <LectureDialogLine title='Note: ' content={note} />
        <LectureDialogLine title='Show link: ' content={showLink} />
        <LectureDialogLine title='Color text: ' content={colorText} />
      </div>
    </DialogContent>
  )
}

export default LectureDialog