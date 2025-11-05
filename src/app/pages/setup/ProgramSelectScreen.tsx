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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

function ProgramSelectScreen() {
  const schoolInfo = getSchoolInfo()
  const { previousStep } = useWizard()
  const { changeSettings } = useSettings()
  const [selectedBranches, setSelectedBranches] = useState<string[]>([])
  const [treeView, setTreeView] = useState(false)

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
    <div className="flex h-screen justify-center items-center ml-3 mr-3">
      <Card className="w-full max-w-lg max-h-3/4 flex flex-col">
        <CardContent className="gap-4 flex flex-col flex-1 overflow-auto">
          <div>
            {
            treeView ?
            <TreeViewProgramSelect schoolCode={schoolInfo.schoolCode} selectedBranches={selectedBranches} setSelectedBranches={setSelectedBranches} />
            :
            <DropdownProgramSelect schoolCode={schoolInfo.schoolCode} selectedBranches={selectedBranches} setSelectedBranches={setSelectedBranches} />
          }
          </div>
          <div className="gap-4 flex flex-col">
            <div className="flex items-center gap-3">
              <Checkbox id="terms" onClick={() => {
                setTreeView(!treeView)
                setSelectedBranches([])
              }} />
              <Label htmlFor="terms">Advanced mode</Label>
            </div>
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