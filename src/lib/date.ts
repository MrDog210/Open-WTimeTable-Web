

export function getISODateNoTimestamp(date: Date) {
  const [withoutTime] = date.toISOString().split('T');
  return withoutTime
}

export function getSchoolYearDates() {
  const currentDate = new Date()
  let startDate, endDate
  if(currentDate.getMonth()>=8) { // then we start this year to +1
    startDate = new Date(`${currentDate.getFullYear()}-09-01`)
    endDate = new Date(`${currentDate.getFullYear()+1}-08-30`)
  } else {
    startDate = new Date(`${currentDate.getFullYear()-1}-09-01`)
    endDate = new Date(`${currentDate.getFullYear()}-08-30`)
  }

  return {startDate, endDate}
}
