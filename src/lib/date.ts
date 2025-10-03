

export function getISODateNoTimestamp(date: Date) {
  const [withoutTime] = date.toISOString().split('T');
  return withoutTime
}