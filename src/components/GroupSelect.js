import { useEffect, useState } from "react";
import { fetchGroupsForBranch } from "../util/http";
import StyledSelect from "./form/StyledSelect";

function GroupSelect({schoolCode, branchId, selectedGroups, setSelectedGroups}) {
  const [groups, setGroups] = useState([])
  useEffect(() => {
    async function fetchAndSetAllGroups() {
      if(!branchId || !schoolCode)
        return;
      const allGroups = await fetchGroupsForBranch(schoolCode, branchId)
      console.log(allGroups)
      setGroups(allGroups)
    }
    console.log("branchId" + branchId)
    fetchAndSetAllGroups()
  }, [branchId, schoolCode])
  
  return (
    <div>
      <div>Groups:</div>
      <StyledSelect isDisabled={branchId == null} value={selectedGroups} options={groups} getOptionLabel={opt => opt.name} getOptionValue={opt => opt.id} isMulti={true} onChange={setSelectedGroups}/>
    </div>
  )
}

export default GroupSelect