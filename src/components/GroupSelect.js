import { useEffect, useState } from "react";
import { fetchGroupsForBranch } from "../util/http";
import Select from "react-select";

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
    setGroups([])
    fetchAndSetAllGroups()
  }, [branchId])
  
  return (
    <div>
      Group select
      <Select options={groups} getOptionLabel={opt => opt.name} getOptionValue={opt => opt.id} isMulti={true} onChange={setSelectedGroups}/>
    </div>
  )
}

export default GroupSelect