import type { DropdownProgramSelectProps } from "@/lib/types"
import { TreeView, type TreeDataItem } from "../tree-view"
import { Check, CircleCheck, Loader2Icon, SquareCheck } from "lucide-react";
import { fetchBranchesForProgramm, getBasicProgrammes } from "@/lib/http/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function TreeViewProgramSelect({
  setSelectedBranches,
  schoolCode,
}: DropdownProgramSelectProps) {
  const queryClient = useQueryClient();

  const { data: programms } = useQuery<TreeDataItem[]>({
    initialData: [],
    queryFn: async () => {
      const p = await getBasicProgrammes(schoolCode)

      return p.map((programme): TreeDataItem => ({
        ...programme,
        children: Array(Number(programme.year)).fill(null).map((_, index): TreeDataItem => ({
          id: String(index + 1),
          name: String(index + 1),
          children: [],
          onClick: () => addBranchToProgram.mutateAsync({index, programmeId: programme.id})
        }))
      }))
    },
    queryKey: ["treeProgrammes", { schoolCode }],
  });

  const addBranchToProgram = useMutation({
    mutationFn: async ({ index, programmeId }: { index: number, programmeId: string}) => {
      const year = index + 1
      const clickedProgramme = programms.find(p => p.id === programmeId)
      if(clickedProgramme && clickedProgramme.children![index].children?.length !== 0)
        return undefined
      const branches = await fetchBranchesForProgramm(
        schoolCode,
        programmeId,
        String(year)
      );
      const treeBranches = branches.map(({ id, branchName }): TreeDataItem => ({
        id,
        name: branchName,
        selectedIcon: () => <CircleCheck className="mr-2" />
      }))
      return programms.map((p) => {
          if (String((p as any).id) !== String(programmeId) && !((p as any).programmeId === programmeId)) {
            return p;
          }

          const newChildren = (p.children ?? []).map((child, i) =>
            i === index ? { ...child, children: treeBranches } : child
          );

          return { ...p, children: newChildren };
        })
    },
    onSuccess: (newData) => {
      if(newData)
        queryClient.setQueryData(["treeProgrammes", { schoolCode }], newData);
    },
  });

  if(programms.length === 0)
    return <div className="flex flex-1 justify-center items-center min-h-50"><Loader2Icon className="animate-spin" /></div>

  return (
    <div className="overflow-auto">
      <div className="font-bold">Select branch or branches</div>
      <TreeView className="mb-0 pb-0" data={programms} onSelectChange={(items) => setSelectedBranches(items.map(i => i.id))} />
    </div>
  )
}

export default TreeViewProgramSelect