import { Button } from "@/components/ui/button"
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchBranchesForProgramm, fetchLecturesForGroups, getBasicProgrammes } from "@/lib/http/api"
import { getAndSetAllDistinctBranchGroups, getCoursesWithGroups } from "@/lib/timetableUtils"
import type { Programme } from "@/lib/types"
import { getSchoolInfo } from "@/stores/schoolData"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import dayjs from "dayjs"
import { getSchoolYearDates } from "@/lib/date"
import { Loader2Icon } from "lucide-react"
import { useWizard } from "react-use-wizard"

function ProgramSelectScreen() {
  const schoolInfo = getSchoolInfo()
  const { nextStep, previousStep } = useWizard()

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

  const saveSelectedBranches = useMutation({
    mutationFn: async () => {
      const groups = await getAndSetAllDistinctBranchGroups(schoolInfo.schoolCode, selectedBranches)
      const {startDate, endDate} = getSchoolYearDates()
      const lectures = await fetchLecturesForGroups(schoolInfo.schoolCode, groups, startDate, endDate)
      //const lectures = await fetchLecturesForGroups(schoolInfo.schoolCode, groups, dayjs().subtract(1, 'months').toDate(), dayjs().add(2, 'months').toDate())
      const start = performance.now()
      console.log(getCoursesWithGroups(lectures, groups.map((g) => g.id)))
      console.log(performance.now() - start)
    },
    onSuccess: () => {
      nextStep()
    }
  })

  function onConformPressed() {
    saveSelectedBranches.mutate()
  }
  
  //console.log(selectedProgramme)
  return (
    <div>
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

      {
        selectedProgramme && <>
        <h2>Select year</h2>
        <Select 
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
            { [...Array(Number(selectedProgramme.year))].map((_, i) => <SelectItem key={i} value={String(i+1)}>{i+1}</SelectItem>) }
          </SelectGroup>
        </SelectContent>
      </Select>
      </>
      }
      {
        selectedProgramme && selectedYear && <>
          <h2>Select branches</h2>
          <MultiSelect
            options={branches}
            value={selectedBranches}
            onValueChange={setSelectedBranches}
          />
        </>
      }
      <Button onClick={previousStep}>Back</Button>
      <Button disabled={selectedBranches.length === 0 || saveSelectedBranches.isPending } onClick={onConformPressed}>
        { saveSelectedBranches.isPending && <Loader2Icon className="animate-spin" />}
        Confirm
      </Button>
    </div>
  )
}

export default ProgramSelectScreen