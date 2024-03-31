import { useEffect, useState } from "react"
import { fetchBranchesForProgramm, getBasicProgrammes } from "../util/http"
import StyledSelect from "./form/StyledSelect"

function generateYearsOfProgram(maxYears) {
  const numOfYears = Number(maxYears)
  const years = []
  for(let i = 1; i <= numOfYears; i++)
    years.push({id: i, name: i.toString()})

  return years
}

function ProgramSelect({schoolCode, selectedProgramm, setSelectedProgramm, selectedYear, setSelectedYear, selectedBranch, setSelectedBranch}) {
  const [isLoadingProgramms, setIsLoadingProgramms] = useState(false)
  const [programms, setProgramms] = useState([])

  const [years, setYears] = useState(null)

  const [isLoadingBranches, setIsLoadingBranches] = useState(false)
  const [branches, setBranches] = useState(null)

  useEffect(() => {
    async function fetchPrograms() {
      if(!schoolCode) return

      setYears(null)
      setBranches(null)
      //setSelectedYear(null)
      //setSelectedBranch(null)
      setIsLoadingProgramms(true)

      const prog = await getBasicProgrammes(schoolCode)
      console.log(prog)
      setProgramms(prog)

      setIsLoadingProgramms(false)
    }
    fetchPrograms()
  }, [schoolCode])

  useEffect(() => {
    async function generateAndSetYears() {
      if(!selectedProgramm || !schoolCode)
        return
      setBranches(null)
      //setSelectedBranch(null)
      console.log(selectedProgramm)
      const y = generateYearsOfProgram(selectedProgramm.year)
      setYears(y)
    }
    generateAndSetYears()
  }, [selectedProgramm, schoolCode])

  useEffect(() => {
    async function fetchAndSetBranches() {
      if(!selectedYear || !schoolCode)
        return
      setIsLoadingBranches(true)
      console.log(selectedYear)
      const b = await fetchBranchesForProgramm(schoolCode, selectedProgramm.id, selectedYear.id)
      setBranches(b)
      setIsLoadingBranches(false)
    }
    fetchAndSetBranches()
  }, [selectedYear, schoolCode])

  return (
    <div>
      <div>Programm:</div>
      <StyledSelect value={selectedProgramm} options={programms} getOptionLabel={opt => opt.name} getOptionValue={opt => opt.id} onChange={setSelectedProgramm} isLoading={isLoadingProgramms}/>
      <div>Year:</div>
      <StyledSelect isDisabled={years == null} value={selectedYear} options={years} getOptionLabel={opt => opt.name} getOptionValue={opt => opt.id} onChange={value => {setSelectedBranch(null);console.log("set years" + selectedBranch);setSelectedYear(value)}}/>
      <div>Branch:</div>
      <StyledSelect isDisabled={branches == null} value={selectedBranch} options={branches} getOptionLabel={opt => opt.branchName} getOptionValue={opt => opt.id} onChange={setSelectedBranch} isLoading={isLoadingBranches} />
    </div>
  )
}

export default ProgramSelect