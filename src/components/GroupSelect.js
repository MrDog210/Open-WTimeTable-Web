import { useEffect, useState } from "react";
import { fetchAllDistinctGroupsForEachCourse } from "../util/wiseUtils";

function GroupSelect({schoolCode, branchId}) {
  const [coursesAndTheirGroups, setCoursesAndTheirGroups] = useState([])

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
      {coursesAndTheirGroups.map((value) => <div>{JSON.stringify(value)}</div>)}
    </div>
  )
}

export default GroupSelect