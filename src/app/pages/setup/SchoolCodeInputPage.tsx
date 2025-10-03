import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function SchoolCodeInputPage() {

  return (
    <div className="flex h-screen flex-col justify-center items-center gap-4 ">
      <form className="flex flex-col gap-4" onSubmit={(e) => {
        e.preventDefault()
      }}>
        <Input minLength={1} type="text" placeholder="Enter your school code (feri)" className="w-72" />
        <Button type="submit" className="w-72">Submit</Button>
      </form>
    </div>
  )
}

export default SchoolCodeInputPage