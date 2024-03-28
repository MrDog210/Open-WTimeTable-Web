import { useLocation } from "wouter";
import ProgramSelect from "../components/ProgramSelect";
import GroupSelect from "../components/GroupSelect";
import { useState } from "react";

function SchoolSetupPage({schoolCode}) {
  const [location, setLocation] = useLocation();
  const [selectedOptions, setSelectedOptions] = useState(null)
  const [selectedGroups, setSelectedGroups] = useState(null)

  return (
    <div>
      <ProgramSelect schoolCode={schoolCode} onSelectedOptionsConfirmed={setSelectedOptions} />
      <GroupSelect onSelectedGroups={setSelectedGroups} schoolCode={schoolCode} branchId={selectedOptions ? selectedOptions.branch.id : null} />
      {selectedGroups && <button>Finish setup</button>}
    </div>
  )
}

export default SchoolSetupPage