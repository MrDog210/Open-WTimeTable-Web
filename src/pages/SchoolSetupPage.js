import { useLocation } from "wouter";
import ProgramSelect from "../components/ProgramSelect";
import GroupSelect from "../components/GroupSelect";
import { useState } from "react";
import { setSelectedGroups, setSelectedProgramYearAndBranch, setStoredSchoolCode } from "../util/webStorage";

function SchoolSetupPage({schoolCode}) {
  const [location, setLocation] = useLocation();
  const [selectedOptions, setSelectedOptions] = useState(null)
  const [coursesAndTheirGroups, setCoursesAndTheirGroups] = useState([])

  function onFinished() {
    setSelectedProgramYearAndBranch(selectedOptions)
    setSelectedGroups(coursesAndTheirGroups)
    setStoredSchoolCode(schoolCode)

    setLocation(`/timetable/${schoolCode}`)
  }

  return (
    <div>
      <ProgramSelect schoolCode={schoolCode} onSelectedOptionsConfirmed={setSelectedOptions} />
      <GroupSelect schoolCode={schoolCode} branchId={selectedOptions ? selectedOptions.branch.id : null} 
        coursesAndTheirGroups={coursesAndTheirGroups} setCoursesAndTheirGroups={setCoursesAndTheirGroups}
      />
      {coursesAndTheirGroups.length > 0 && <button onClick={onFinished}>Finish setup</button>}
    </div>
  )
}

export default SchoolSetupPage