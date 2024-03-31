import { useLocation } from "wouter";
import ProgramSelect from "../components/ProgramSelect";
import GroupSelect from "../components/GroupSelect";
import { useEffect, useState } from "react";
import { storeSelectedGroups as storeSelectedGroups, setSelectedProgramYearAndBranch, setStoredSchoolCode } from "../util/webStorage";

function SchoolSetupPage({schoolCode}) {
  const [location, setLocation] = useLocation();
  const [selectedOptions, setSelectedOptions] = useState(null)
  const [selectedGroups, setSelectedGroups] = useState([])

  function onFinished() {
    setSelectedProgramYearAndBranch(selectedOptions)
    storeSelectedGroups(selectedGroups)
    setStoredSchoolCode(schoolCode)

    setLocation(`/timetable/${schoolCode}`)
  }

  useEffect(() => {
    console.log(selectedGroups)
  }, [selectedGroups])

  return (
    <div>
      <ProgramSelect schoolCode={schoolCode} onSelectedOptionsConfirmed={setSelectedOptions} />
      <GroupSelect schoolCode={schoolCode} branchId={selectedOptions ? selectedOptions.branch.id : null} 
        selectedGroups={selectedGroups} setSelectedGroups={setSelectedGroups}
      />
      { selectedGroups.length > 0 && <button onClick={onFinished}>Finish setup</button>}
    </div>
  )
}

export default SchoolSetupPage