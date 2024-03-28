import { useEffect, useRef, useState } from "react"
import { fetchBranchesForProgramm, getBasicProgrammes } from "../util/http"
import Select from "react-select"


function generateYearsOfProgram(maxYears) {
  const numOfYears = Number(maxYears)
  const years = []
  for(let i = 1; i <= numOfYears; i++)
    years.push({id: i, name: i.toString()})

  return years
}

function ProgramSelect({schoolCode, onSelectedOptionsConfirmed}) {
  const [isLoadingProgramms, setIsLoadingProgramms] = useState(false)
  const [programms, setProgramms] = useState([])
  const [selectedProgramm, setSelectedProgramm] = useState(null)

  const [years, setYears] = useState(null)
  const [selectedYear, setSelectedYear] = useState(null)

  const [isLoadingBranches, setIsLoadingBranches] = useState(false)
  const [branches, setBranches] = useState(null)
  const [selectedBranch, setSelectedBranch] = useState(null)

  useEffect(() => {
    async function fetchPrograms() {
      setYears(null)
      setBranches(null)
      setSelectedBranch(null)
      setIsLoadingProgramms(true)

      const prog = await getBasicProgrammes(schoolCode)
      console.log(prog)
      setProgramms(prog)

      setIsLoadingProgramms(false)
    }
    fetchPrograms()
  }, [])

  useEffect(() => {
    async function generateAndSetYears() {
      if(!selectedProgramm)
        return
      setBranches(null)
      setSelectedBranch(null)
      console.log(selectedProgramm)
      const y = generateYearsOfProgram(selectedProgramm.year)
      setYears(y)
    }
    generateAndSetYears()
  }, [selectedProgramm])

  useEffect(() => {
    async function fetchAndSetBranches() {
      if(!selectedYear)
        return
      setIsLoadingBranches(true)
      console.log(selectedYear)
      const b = await fetchBranchesForProgramm(schoolCode, selectedProgramm.id, selectedYear.id)
      setBranches(b)
      setIsLoadingBranches(false)
    }
    fetchAndSetBranches()
  }, [selectedYear])

  useEffect(() => {
    if(!selectedBranch)
      return
    onSelectedOptionsConfirmed({programm: selectedProgramm, year: selectedYear.id, branch: selectedBranch})
  }, [selectedBranch])

  return (
    <div>
      <Select options={programms} getOptionLabel={opt => opt.name} getOptionValue={opt => opt.id} onChange={setSelectedProgramm} isLoading={isLoadingProgramms}/>
      { years && <Select options={years} getOptionLabel={opt => opt.name} getOptionValue={opt => opt.id} onChange={setSelectedYear}/>}
      { branches && <Select options={branches} getOptionLabel={opt => opt.branchName} getOptionValue={opt => opt.id} onChange={setSelectedBranch} isLoading={isLoadingBranches} />}
    </div>
  )
}

export default ProgramSelect