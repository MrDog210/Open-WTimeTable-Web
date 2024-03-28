import { dateFromNow } from "./dateUtils"
import { fetchGroupsForBranch, fetchLecturesForGroups, getSchoolInfo } from "./http"

export async function isSchoolCodeValid(schoolCode) {
  try {
    const data = await getSchoolInfo(schoolCode)
    return data.schoolCode
  } catch (error) {
    console.log(error)
  }
  return null
}

export async function fetchAllDistinctGroupsForEachCourse(schoolCode, branchId) {
  const allGroups = await fetchGroupsForBranch(schoolCode, branchId)
  console.log(allGroups)
  const lectures = await fetchLecturesForGroups(schoolCode, allGroups, new Date(), dateFromNow(30))
  console.log(lectures)

  const uniqueCoursesAndGroups = []
  lectures.forEach((lecture) => {
    if(!lecture.course || lecture.course == '')
      return

    const index = uniqueCoursesAndGroups.findIndex(cg => cg.course.id == lecture.courseId)
    if(index === -1)
      uniqueCoursesAndGroups.push({course: {id: lecture.courseId, name: lecture.course}, groups: []})

    const cg = uniqueCoursesAndGroups.at(index)
    lecture.groups?.forEach(group => {
      const index = cg.groups.findIndex(g => g.id == group.id)
      if(index == -1)
        cg.groups.push({...group, selected: false})
    })
  })
  console.log(uniqueCoursesAndGroups)
  return uniqueCoursesAndGroups
}