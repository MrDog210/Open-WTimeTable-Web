import { Button } from "@/components/ui/button"
import { getAndSetAllDistinctBranchGroups } from "@/lib/timetableUtils"
import { getSchoolInfo, saveSelectedBranches } from "@/stores/schoolData"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { Loader2Icon } from "lucide-react"
import { useWizard } from "react-use-wizard"
import { useSettings } from "@/context/UserSettingsContext"
import { Card, CardContent } from "@/components/ui/card"
import DropdownProgramSelect from "@/components/programSelect/DropdownProgramSelect"
import TreeViewProgramSelect from "@/components/programSelect/TreeViewProgramSelect"

function ProgramSelectScreen() {
  const schoolInfo = getSchoolInfo()
  const { previousStep } = useWizard()
  const { changeSettings } = useSettings()
  const [selectedBranches, setSelectedBranches] = useState<string[]>([])
  const [treeView, setTreeView] = useState(true)

  const saveSelectedBranchesMutation = useMutation({
    mutationFn: async () => {
      saveSelectedBranches(selectedBranches)
      return getAndSetAllDistinctBranchGroups(schoolInfo.schoolCode, selectedBranches)
    },
    onSuccess: () => {
      changeSettings({
        hasCompletedSetup: true
      })
    }
  })

  function onConformPressed() {
    saveSelectedBranchesMutation.mutate()
  }
  
  //console.log(selectedProgramme)
  return (
    <div className="flex h-screen justify-center items-center m-5">
      <Card className="w-full max-w-sm">
        <CardContent className="gap-4 flex flex-col">
          {
            treeView ?
            <TreeViewProgramSelect schoolCode={schoolInfo.schoolCode} selectedBranches={selectedBranches} setSelectedBranches={setSelectedBranches} />
            :
            <DropdownProgramSelect schoolCode={schoolInfo.schoolCode} selectedBranches={selectedBranches} setSelectedBranches={setSelectedBranches} />
          }
          <div className="gap-4 flex flex-col">
          <Button variant={"secondary"} onClick={previousStep}>Back</Button>
          <Button disabled={selectedBranches.length === 0 || saveSelectedBranchesMutation.isPending } onClick={onConformPressed}>
            { saveSelectedBranchesMutation.isPending && <Loader2Icon className="animate-spin" />}
            Confirm
          </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProgramSelectScreen