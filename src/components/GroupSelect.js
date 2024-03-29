import { useEffect, useState } from "react";
import { fetchAllDistinctGroupsForEachCourse } from "../util/wiseUtils";
import CourseGroupSelectForm from "./form/CourseGroupSelectForm";

function GroupSelect({schoolCode, branchId, coursesAndTheirGroups, setCoursesAndTheirGroups}) {
  useEffect(() => {
    async function fetchAndSetAllGroups() {
      if(!branchId || !schoolCode)
        return;
      const data = await fetchAllDistinctGroupsForEachCourse(schoolCode, branchId)
      setCoursesAndTheirGroups(data)
    }
    fetchAndSetAllGroups()
  }, [branchId])
  
  return (
    <div>
      Group select
      {coursesAndTheirGroups.map((value) => <CourseGroupSelectForm course={value.course} groups={value.groups} />)}
      <button onClick={() => console.log(coursesAndTheirGroups)}>Press me</button>
    </div>
  )
}

export default GroupSelect