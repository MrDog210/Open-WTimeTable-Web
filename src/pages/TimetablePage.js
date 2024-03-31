import { useEffect, useState } from "react";
import GroupSelect from "../components/GroupSelect";
import ProgramSelect from "../components/ProgramSelect";
import TimeTable from "../components/TimeTable/TimeTable";
import { getSelectedGroups, getSelectedProgramYearAndBranch, getStoredSchoolCode, setSelectedProgramYearAndBranch, setStoredSchoolCode, storeSelectedGroups } from "../util/webStorage";
import { useLocation } from "wouter";
import { getSchoolInfo } from "../util/http";

function TimetablePage({firstSchoolCode}) {
  const [location, setLocation] = useLocation();
  const [schoolCode, setSchoolCode] = useState(null)
  const [selectedOptions, setSelectedOptions] = useState(getSelectedProgramYearAndBranch(firstSchoolCode))
  const [selectedGroups, setSelectedGroups] = useState(getSelectedGroups(firstSchoolCode))

  useEffect(() => {
    async function getOrFetchSchoolCode() {
      try {
        const schoolInfo = await getSchoolInfo(firstSchoolCode)
        setSchoolCode(schoolInfo.schoolCode)
        setStoredSchoolCode(firstSchoolCode, schoolInfo.schoolCode)
      } catch (error) {
        window.alert(error)
        setLocation('/')
      }
    }

    const storedCode = getStoredSchoolCode(firstSchoolCode)
    if(storedCode != null)
      setSchoolCode(storedCode)
    else
      getOrFetchSchoolCode()
  }, [])

  useEffect(() => {
    if(!selectedGroups)
      return
    setSelectedProgramYearAndBranch(firstSchoolCode, selectedOptions)
    storeSelectedGroups(firstSchoolCode, selectedGroups)
  }, [selectedGroups])

  return (
    <div>
      <div>
        <ProgramSelect schoolCode={schoolCode} defaultProgramm={selectedOptions?.programm} 
        defaultYear={selectedOptions?.year} defaultBranch={selectedOptions?.branch} onSelectedOptionsConfirmed={setSelectedOptions} />
        <GroupSelect schoolCode={schoolCode} branchId={selectedOptions?.branch.id} 
          selectedGroups={selectedGroups} setSelectedGroups={setSelectedGroups}
        />
      </div>
      <TimeTable groups={selectedGroups} schoolCode={'wtt_um_feri'} />
    </div>
  )
}

export default TimetablePage