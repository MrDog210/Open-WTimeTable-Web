import { Button } from "@/components/ui/button"
import { getSchoolInfo } from "@/lib/http/api"
import { setSchoolInfo, setUrlSchoolCode } from "@/stores/schoolData"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { Info, Loader2Icon, Search } from "lucide-react"
import { useWizard } from "react-use-wizard"
import banner from '@/assets/banner.webp'
import findCode from '@/assets/findCode.webp'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { InputGroup, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import facultiesData from '@/assets/FacultyCodes.json'
import type { FacultyCode } from "@/lib/types"

const faculties: FacultyCode[] = facultiesData as FacultyCode[]

function SchoolCodeInputPage() {
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const { nextStep } = useWizard();

  const schoolInfoMutation = useMutation({
    mutationFn: async () => {
      const schoolInfo = await getSchoolInfo(code)
      setSchoolInfo(schoolInfo)
      setUrlSchoolCode(code)
      return schoolInfo
    },
    onError: (error) => {
      console.error(error)
    },
    onSuccess: () => {
      nextStep()
    }
  })
  
  return (
    <div className="flex h-screen flex-col justify-center items-center gap-5">
      <img src={banner} alt="banner" fetchPriority="high" className="p-5 md:max-w-130 bg-gray-800 rounded-2xl overflow-hidden dark:bg-transparent"/>
      <form className="flex flex-col gap-4 w-screen md:max-w-100 p-5 max-w-sm" onSubmit={(e) => {
        e.preventDefault()
        if(schoolInfoMutation.isPending) return
        schoolInfoMutation.mutate()
      }}>
        <div className="flex gap-2">
          <Popover open={open} onOpenChange={setOpen}>
              <InputGroup>
                <InputGroupInput className={schoolInfoMutation.isError ? 'border-red-400' : undefined} minLength={1} required type="text" placeholder="Enter your school code (eg: 'feri')" value={code} onChange={(e) => setCode(e.target.value)} />
            <PopoverTrigger asChild>
                <InputGroupButton className="rounded-full mr-1" size="icon-xs" >
                  <Search />
                </InputGroupButton>
            </PopoverTrigger>
              </InputGroup>
            <PopoverContent align="end" sideOffset={15} className="p-0 w-75 max-w-dvw">
              <StatusList setOpen={setOpen} setSelectedStatus={(faculty) => {
                console.log(faculty)
                if(faculty)
                  setCode(faculty.inputCode)
              }} />
            </PopoverContent>
          </Popover>
          <Button type="button" variant="outline" onClick={() => setDialogOpen(true)}>
            <Info />
          </Button>
        </div>
        <Button disabled={schoolInfoMutation.isPending || code.length === 0}  type="submit">
          { schoolInfoMutation.isPending && <Loader2Icon className="animate-spin" />}
          Confirm
        </Button>
      </form>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How to find the school code?</DialogTitle>
            <DialogDescription className="flex flex-col gap-2">
              <div>1. Open your faculty wise timetable page</div>
              <div>2. At the bottom of the page find code: ...</div>
              <img src={findCode} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SchoolCodeInputPage


function StatusList({
  setOpen,
  setSelectedStatus,
}: {
  setOpen: (open: boolean) => void
  setSelectedStatus: (faculty: FacultyCode | null) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>We might not have this code scraped :( </CommandEmpty>
        <CommandGroup>
          {faculties.map((faculty) => {
            const label = `${faculty.schoolName} - ${faculty.schoolCity} (${faculty.inputCode})`
            return (
            <CommandItem
              key={faculty.inputCode}
              value={label}
              onSelect={(value) => {
                console.log(value)
                setSelectedStatus(faculty)
                setOpen(false)
              }}
            >
              {label}
            </CommandItem>
          )})}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}