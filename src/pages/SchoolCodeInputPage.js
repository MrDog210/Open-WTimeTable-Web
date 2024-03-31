import { useState } from "react"
import { isSchoolCodeValid } from "../util/wiseUtils"
import { useLocation } from "wouter";
import classes from './SchoolCodeInputPage.module.css'
import { setStoredfirstSchoolCode } from "../util/webStorage";

function SchoolCodeInputPage({}) {
  const [schoolCode, setSchoolCode] = useState("")
  const [location, setLocation] = useLocation();

  async function onConfirm(event) {
    event.preventDefault();
    if(!await isSchoolCodeValid(schoolCode))
      return;
    setStoredfirstSchoolCode(schoolCode)
    setLocation(`/${schoolCode}`)
  }

  return (
    <div className={classes.container}>
      <div className={classes.center}>
        <form onSubmit={onConfirm}>
          <label htmlFor="schoolCode">Enter school code:</label> <br />
          <input style={{marginTop: 5}} id="schoolCode" enterKeyHint="next" oncon type="text" value={schoolCode} onChange={e => setSchoolCode(e.target.value)}></input>
          <button style={{marginTop: 5}} onClick={onConfirm}>CONFIRM</button>
        </form>
      </div>
    </div>
  )
}

export default SchoolCodeInputPage