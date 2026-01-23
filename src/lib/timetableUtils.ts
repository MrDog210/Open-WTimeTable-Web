import { getSchoolInfo, getSelectedBranches, setAllBranchGroups } from "@/stores/schoolData"
import { fetchGroupsForBranch, fetchLecturesForGroups } from "./http/api"
import type { Course, CoursesAndTheirGroups, GroupBranchChild, GroupBranchMain, GroupLecture, LectureWise } from "./types"
import { getSchoolYearDates } from "./date"
import type { SelectedGroups } from "@/context/UserSettingsContext"

export async function getAndSetAllDistinctBranchGroups(schoolCode: string, chosenBranchesID: string[]) {
  const groups: GroupBranchChild[] = []
  for (const branchId of chosenBranchesID)
    groups.push(...getAllUniqueGroups(await fetchGroupsForBranch(schoolCode, branchId)))
  await setAllBranchGroups(groups)
  return groups
}

export function getAllUniqueGroups(allGroups: GroupBranchMain[]) {
  const groups: GroupBranchChild[] = []

  allGroups.forEach(group => {
    const index = groups.findIndex((g) => g.id === Number(group.id))

    if (index === -1) // if there is no matching group already in our unique groups, we add this group
      groups.push({
        id: Number(group.id), 
        name: group.name
      })
  });

  return groups
}

type TempCoursesAndTheirGroups = {
  course: Course,
  groups: Map<number, GroupLecture>
}

export function getCoursesWithGroups(lectures: LectureWise[], allGroupsForBranches: number[]): CoursesAndTheirGroups[] {
  const courses = new Map<string, TempCoursesAndTheirGroups>()

  for(const lecture of lectures) {
    if(lecture.course === '') continue
    if(!courses.has(lecture.courseId)) {
      courses.set(lecture.courseId, {
        course: {
          course: lecture.course,
          id: lecture.courseId
        },
        groups: new Map()
      })
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    const savedG = courses.get(lecture.courseId)?.groups!
    for(const group of lecture.groups) {
      if(!savedG.has(group.id))
        savedG.set(group.id, group)
    }
  }

  const result: CoursesAndTheirGroups[] = []
  courses.forEach((value) => {
    result.push({
      course: value.course,
      groups: Array.from(value.groups.values()).filter((g) => allGroupsForBranches.includes(g.id)).map((g) => ({...g, selected: false})) // filter out groups from other 
    })
  })
  return result
}

export async function fetchCoursesAndTheirGroups() {
  const {startDate, endDate} = getSchoolYearDates()
  const schoolInfo = getSchoolInfo()
  const selectedBranches = getSelectedBranches()
  const groups = await getAndSetAllDistinctBranchGroups(schoolInfo.schoolCode, selectedBranches)
  const lectures = await fetchLecturesForGroups(schoolInfo.schoolCode, groups, startDate, endDate)
  //const lectures = await fetchLecturesForGroups(schoolInfo.schoolCode, groups, dayjs().subtract(1, 'months').toDate(), dayjs().add(2, 'months').toDate())
  return getCoursesWithGroups(lectures, groups.map((g) => g.id))
}

export function getDistinctSelectedGroups(selectedGroups: SelectedGroups) {
  const distinct: string[] = []

  for(const courseId in selectedGroups) {
    for(const group of selectedGroups[courseId]) {
      if(!distinct.includes(group))
        distinct.push(group)
    }
  }
  
  return distinct
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatArray<T extends Record<string, any>>(
  array: T[],
  key: keyof T
): string {
  return array.map(item => String(item[key])).join(', ')
}

import ical, { ICalCalendarMethod } from 'ical-generator';

export function exportDataToIcs(lectures: LectureWise[]) {
  const calendar = ical({ name: 'OPEN WTT EXPORT' });
  calendar.method(ICalCalendarMethod.ADD);

  for(const { start_time, end_time, course, rooms, lecturers, executionType, showLink } of lectures) {
    const lecturersNames = formatArray(lecturers, "name") 
    calendar.createEvent({
      start: start_time,
      end: end_time,
      summary: `${course} - ${executionType}`,
      description: '',
      url: showLink,
      location: formatArray(rooms, "name"),
      organizer: {
        name: lecturersNames === "" ? "No lecturers" : lecturersNames
      }
   });
  }

  return calendar
}

export function stringToFile(data: string, type: 'text/calendar', fileName: string) {
    const blob = new Blob([data], { type });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click(); 

    // Clean up the temporary elements
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function filterLecturesBySelectedGroups(lectures: LectureWise[], selectedGroups: SelectedGroups) {
  return lectures.filter(({groups, courseId, course}) => {
    if(course === '') return true
    for(const group of groups)
      if(selectedGroups[courseId] && selectedGroups[courseId].includes(group.id as unknown as string))
        return true
    return false
  })
}