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

export function formatArray(array: { [key: string]: any }[], key: string) {
  let string = ''
  for(let i = 0; i<array.length; i++)
    string += array[i][key] +((i !== array.length -1) ? ', ' : '')

  return string
}