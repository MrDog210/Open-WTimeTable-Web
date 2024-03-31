import { useEffect, useState } from "react";
import GroupSelect from "../components/GroupSelect";
import ProgramSelect from "../components/ProgramSelect";
import TimeTable from "../components/TimeTable/TimeTable";
import { getSelectedGroups, getSelectedProgramYearAndBranch, getStoredSchoolCode, setSelectedProgramYearAndBranch, setStoredSchoolCode, storeSelectedGroups } from "../util/webStorage";
import { useLocation } from "wouter";
import { getSchoolInfo } from "../util/http";
import Collapse from "@kunukn/react-collapse";
import classes from './TimetablePage.module.css'

function TimetablePage({firstSchoolCode}) {
  const [location, setLocation] = useLocation();
  const [schoolCode, setSchoolCode] = useState(null)
  const [selectedOptions, setSelectedOptions] = useState(getSelectedProgramYearAndBranch(firstSchoolCode))
  const [selectedGroups, setSelectedGroups] = useState(getSelectedGroups(firstSchoolCode))
  const [optionsOpen, setOptionsOpen] = useState(false)

  useEffect(() => {
    async function getOrFetchSchoolCode() {
      try {
        const schoolInfo = await getSchoolInfo(firstSchoolCode)
        setSchoolCode(schoolInfo.schoolCode)
        setStoredSchoolCode(firstSchoolCode, schoolInfo.schoolCode)
      } catch (error) {
        //window.alert(error)
        //setLocation('/')
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
      <div className={classes["options-container"]}>
        <button onClick={() => {setOptionsOpen(!optionsOpen)}}>change programm</button>
        <Collapse style={{overflow: optionsOpen ? "visible" : "hidden"}} isOpen={optionsOpen}>
          <div className={classes["options-inputs"]}>
            <ProgramSelect schoolCode={schoolCode} 
            selectedProgramm={selectedOptions?.programm} setSelectedProgramm={v => {setSelectedOptions({...selectedOptions, programm: v})}}
            selectedYear={selectedOptions?.year} setSelectedYear={v => {setSelectedOptions({...selectedOptions, year: v})}}
            selectedBranch={selectedOptions?.branch} setSelectedBranch={v => {setSelectedOptions({...selectedOptions, branch: v})}} />
            <GroupSelect schoolCode={schoolCode} branchId={selectedOptions?.branch?.id} 
              selectedGroups={selectedGroups} setSelectedGroups={setSelectedGroups}
            />
          </div>
      </Collapse>
      </div>
      <TimeTable groups={selectedGroups} schoolCode={schoolCode} />
    </div>
  )
}

export default TimetablePage