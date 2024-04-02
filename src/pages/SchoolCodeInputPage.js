import { useState } from "react"
import { isSchoolCodeValid } from "../util/wiseUtils"
import { useLocation } from "wouter";
import classes from './SchoolCodeInputPage.module.css'
import { getStoredfirstSchoolCode, setStoredfirstSchoolCode } from "../util/webStorage";
import banner from './../assets/banner.webp'; 

function SchoolCodeInputPage({}) {
  const [schoolCode, setSchoolCode] = useState("")
  const [warning, setWarning] = useState()
  const [isFetching, setIsFetching] = useState(false)
  const [location, setLocation] = useLocation()

  const code = getStoredfirstSchoolCode()
  if(code)
    setLocation(`/${code}`)

  async function onConfirm(event) {
    event.preventDefault();
    if (isFetching)
      return
    if(schoolCode === '') {
      setWarning('Enter a school code')
      return;
    }
    setIsFetching(true)
    if(!await isSchoolCodeValid(schoolCode)) {
      setWarning('Invalid school code')
      setIsFetching(false)
      return;
    }
    setStoredfirstSchoolCode(schoolCode)
    setLocation(`/${schoolCode}`)
    setIsFetching(false)
  }

  return (
    <div className={classes.container}>
      <div className={classes.center}>
        <div style={{ alignItems: 'center', paddingBottom: 25 }}>
          <img src={banner} className={classes.banner}/>
        </div>
        <form onSubmit={onConfirm}>
          <label htmlFor="schoolCode">Enter school code:</label> <br />
          <input placeholder="FERI" required style={{marginTop: 5}} id="schoolCode" enterKeyHint="next" type="text" value={schoolCode} onChange={e => setSchoolCode(e.target.value)}></input>
          <button disabled={isFetching} style={{marginTop: 5}} onClick={onConfirm}>CONFIRM</button>
          { warning && <div className="warning-content" style={{ marginTop: 15 }}>{warning}</div>}
        </form>
        <div style={{ marginBottom: '20%'}} />
      </div>
    </div>
  )
}

export default SchoolCodeInputPage