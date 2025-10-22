import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSchoolInfo } from "@/lib/http/api"
import { setSchoolInfo, setUrlSchoolCode } from "@/stores/schoolData"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { Info, Loader2Icon } from "lucide-react"
import { useWizard } from "react-use-wizard"
import banner from '@/assets/banner.webp'
import findCode from '@/assets/findCode.webp'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

function SchoolCodeInputPage() {
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
      <img src={banner} alt="banner" className="p-5 md:max-w-130"/>
      <form className="flex flex-col gap-4 w-screen md:max-w-100 p-5 max-w-sm" onSubmit={(e) => {
        e.preventDefault()
        if(schoolInfoMutation.isPending) return
        schoolInfoMutation.mutate()
      }}>
        <div className="flex gap-2">
          <Input className={schoolInfoMutation.isError ? 'border-red-400' : undefined} minLength={1} required type="text" placeholder="Enter your school code (example 'feri')" value={code} onChange={(e) => setCode(e.target.value)} />
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