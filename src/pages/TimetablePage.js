import { useEffect, useState } from "react";
import GroupSelect from "../components/GroupSelect";
import ProgramSelect from "../components/ProgramSelect";
import TimeTable from "../components/TimeTable/TimeTable";
import { clearStorage, getSelectedGroups, getSelectedProgramYearAndBranch, getStoredSchoolCode, setSelectedProgramYearAndBranch, setStoredSchoolCode, storeSelectedGroups } from "../util/webStorage";
import { getSchoolInfo } from "../util/http";
import Collapse from "@kunukn/react-collapse";
import classes from './TimetablePage.module.css'
import IconButton from "../components/IconButton";
import { useLocation } from "wouter";

function TimetablePage({firstSchoolCode}) {
  const [schoolCode, setSchoolCode] = useState(null)
  const [selectedOptions, setSelectedOptions] = useState(getSelectedProgramYearAndBranch(firstSchoolCode))
  const [selectedGroups, setSelectedGroups] = useState(getSelectedGroups(firstSchoolCode))
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [location, setLocation] = useLocation()

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
        <button onClick={() => {setOptionsOpen(!optionsOpen)}}>change programme</button>
        <Collapse style={{overflow: optionsOpen ? "visible" : "hidden"}} isOpen={optionsOpen}>
          <div className={classes["options-inputs"]}>
            <ProgramSelect schoolCode={schoolCode} 
            selectedProgramm={selectedOptions?.programm} setSelectedProgramm={v => {setSelectedOptions({...selectedOptions, programm: v})}}
            selectedYear={selectedOptions?.year} setSelectedYear={v => {setSelectedOptions({...selectedOptions, year: v})}}
            selectedBranch={selectedOptions?.branch} setSelectedBranch={v => {setSelectedOptions({...selectedOptions, branch: v})}} />
            <GroupSelect schoolCode={schoolCode} branchId={selectedOptions?.branch?.id} 
              selectedGroups={selectedGroups} setSelectedGroups={setSelectedGroups}
            />
            <button style={{marginTop: 10, backgroundColor: '#ee6723' }} onClick={() => {
              clearStorage()
              setLocation("/")
            }}>Reset settings</button>
          </div>
      </Collapse>
      </div>
      <TimeTable groups={selectedGroups} schoolCode={schoolCode} />
      <div className={classes.footer}>
        <IconButton text="Download android app" icon="logo-android" href="https://github.com/MrDog210/Open-WTimeTable/releases/latest" />
        <IconButton text="View source code" icon="logo-github" href="https://github.com/MrDog210/Open-WTimeTable-Web" />
        <IconButton text="Report an issue" icon="logo-github" href="https://github.com/MrDog210/Open-WTimeTable-Web/issues/new" />
      </div>
    </div>
  )
}

export default TimetablePage