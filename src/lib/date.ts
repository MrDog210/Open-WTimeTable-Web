

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

export function getMonday(d: Date | string) {
  d = new Date(d);
  const day = d.getDay(),
    diff = d.getDate() - day + 1; // adjust when day is sunday
  return new Date(d.setDate(diff));
}

export function getFriday(d: Date | string) {
  d = getMonday(d)
  const diff = d.getDate() + 4
  return new Date(d.setDate(diff));
}

export function getWeekDates(date: Date | string) {
  return {from: getMonday(date), till: getFriday(date)}
}

export function getTimeFromDate(dateString: Date | string) {
  const date = new Date(dateString)
  let minutes = date.getMinutes().toString()
  if(minutes.length === 1)
    minutes = '0' + minutes
  return `${date.getHours()}:${minutes}`
}