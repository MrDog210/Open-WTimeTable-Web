import { Button } from "@/components/ui/button"
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchBranchesForProgramm, fetchLecturesForGroups, getBasicProgrammes } from "@/lib/http/api"
import { getAndSetAllDistinctBranchGroups, getCoursesWithGroups } from "@/lib/timetableUtils"
import type { Programme } from "@/lib/types"
import { getSchoolInfo, saveSelectedBranches } from "@/stores/schoolData"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Loader2Icon } from "lucide-react"
import { useWizard } from "react-use-wizard"
import { useSettings } from "@/context/UserSettingsContext"
import { Card, CardContent } from "@/components/ui/card"

function ProgramSelectScreen() {
  const schoolInfo = getSchoolInfo()
  const { previousStep } = useWizard()
  const { changeSettings } = useSettings()

  const [selectedProgramme, setSelectedProgramme] = useState<Programme | undefined>(undefined)
  const [selectedYear, setSelectedYear] = useState<string | undefined>(undefined)
  const [selectedBranches, setSelectedBranches] = useState<string[]>([])
  
  const { data: programms, ...basicProgrammesQuery} = useQuery({
    initialData: [],
     queryFn: async () => {
      return getBasicProgrammes(schoolInfo.schoolCode)
    },
    queryKey: [ 'basicProgrammes', { schoolCode: schoolInfo.schoolCode }]
  })

  const { data: branches } = useQuery({
    initialData: [],
    //queryFn: () =>  fetchBranchesForProgramm(schoolInfo.schoolCode, selectedProgramme?.id!, selectedYear!),
    queryFn: async () => {
      const b = await fetchBranchesForProgramm(schoolInfo.schoolCode, selectedProgramme?.id!, selectedYear!)
      return b.map((branch): MultiSelectOption => ({
        value: branch.id,
        label: branch.branchName
      }))
    },
    queryKey: [ 'branchesForProgamme', { schoolCode: schoolInfo.schoolCode, chosenProgrammID: selectedProgramme?.id, chosenYear: selectedYear }],
    enabled: !!selectedProgramme && !!selectedYear
  })

  const saveSelectedBranchesMutation = useMutation({
    mutationFn: async () => {
      saveSelectedBranches(selectedBranches)
      return getAndSetAllDistinctBranchGroups(schoolInfo.schoolCode, selectedBranches)

      /*const groups = await getAndSetAllDistinctBranchGroups(schoolInfo.schoolCode, selectedBranches)
      const {startDate, endDate} = getSchoolYearDates()
      const lectures = await fetchLecturesForGroups(schoolInfo.schoolCode, groups, startDate, endDate)
      //const lectures = await fetchLecturesForGroups(schoolInfo.schoolCode, groups, dayjs().subtract(1, 'months').toDate(), dayjs().add(2, 'months').toDate())
      const start = performance.now()
      scg(getCoursesWithGroups(lectures, groups.map((g) => g.id)))
      console.log(performance.now() - start)*/
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
          <h2>Select program</h2>
          <Select 
            value={selectedProgramme?.id}
            onValueChange={(selectedP) => {
              setSelectedProgramme(programms.find((p) => p.id === selectedP)!)
              setSelectedYear(undefined)
              setSelectedBranches([])
            }
          }>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                { programms.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>) }
              </SelectGroup>
            </SelectContent>
          </Select>


            <h2>Select year</h2>
            <Select 
            disabled={!selectedProgramme}
            value={selectedYear}
            onValueChange={(v) => {
              setSelectedYear(v)
              setSelectedBranches([])
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                { [...Array(Number(!selectedProgramme ? 0 : selectedProgramme.year))].map((_, i) => <SelectItem key={i} value={String(i+1)}>{i+1}</SelectItem>) }
              </SelectGroup>
            </SelectContent>
          </Select>
              <h2>Select branches</h2>
              <MultiSelect // TODO: fix overflow on long labels
              className="max-h-60 overflow-y-auto"
                
                disabled={!selectedProgramme && !selectedYear}
                options={branches}
                value={selectedBranches}
                onValueChange={setSelectedBranches}
              />
          <Button variant={"secondary"} onClick={previousStep}>Back</Button>
          <Button disabled={selectedBranches.length === 0 || saveSelectedBranchesMutation.isPending } onClick={onConformPressed}>
            { saveSelectedBranchesMutation.isPending && <Loader2Icon className="animate-spin" />}
            Confirm
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProgramSelectScreen