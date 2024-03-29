import { useState } from "react"
import { isSchoolCodeValid } from "../util/wiseUtils"
import { useLocation } from "wouter";
import { getSchoolInfo } from "../util/http";
import { setServerUrl, setStoredfirstSchoolCode } from "../util/webStorage";

function SchoolCodeInputPage({}) {
  const [schoolCode, setSchoolCode] = useState("")
  const [location, setLocation] = useLocation();

  async function onConfirm() {
    if(!await isSchoolCodeValid(schoolCode))
      return;
    setStoredfirstSchoolCode(schoolCode)
    const schoolInfo = await getSchoolInfo(schoolCode)
    setLocation(`/setup/${schoolInfo.schoolCode}`)
  }

  return (
    <div>
      <div>Enter school code</div>
      <div>
        <input type="text" value={schoolCode} onChange={e => setSchoolCode(e.target.value)}></input>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    </div>
  )
}

export default SchoolCodeInputPage