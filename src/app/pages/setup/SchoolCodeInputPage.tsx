import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSchoolInfo } from "@/lib/http/api"
import { setSchoolInfo, setUrlSchoolCode } from "@/stores/schoolData"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { Loader2Icon } from "lucide-react"
import { useWizard } from "react-use-wizard"

function SchoolCodeInputPage() {
  const [code, setCode] = useState('')
  const { nextStep } = useWizard();

  const schoolInfoMutation = useMutation({
    mutationFn: async () => {
      const schoolInfo = await getSchoolInfo(code)
      await setSchoolInfo(schoolInfo)
      await setUrlSchoolCode(code)
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
    <div className="flex h-screen flex-col justify-center items-center gap-4 ">
      <form className="flex flex-col gap-4 w-100" onSubmit={(e) => {
        e.preventDefault()
        if(schoolInfoMutation.isPending) return
        schoolInfoMutation.mutate()
      }}>
        <Input minLength={1} required type="text" placeholder="Enter your school code (feri)" value={code} onChange={(e) => setCode(e.target.value)} />
        <Button disabled={schoolInfoMutation.isPending || code.length === 0}  type="submit">
          { schoolInfoMutation.isPending && <Loader2Icon className="animate-spin" />}
          Confirm
        </Button>
      </form>
    </div>
  )
}

export default SchoolCodeInputPage