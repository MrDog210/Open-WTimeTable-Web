import type { DropdownProgramSelectProps } from "@/lib/types"
import { TreeView, type TreeDataItem } from "../tree-view"
import { Check, SquareCheck } from "lucide-react";
import { fetchBranchesForProgramm, getBasicProgrammes } from "@/lib/http/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const data: TreeDataItem[] = [
  {
    id: '1',
    name: 'Item 1',
    
    children: [
      {
        id: '2',
        name: 'Item 1.1',
        children: [
          {
            id: '3',
            name: 'Item 1.1.1',
          },
          {
            id: '4',
            name: 'Item 1.1.2',
            selectedIcon: <Check />,

          },
        ],
      },
      {
        id: '5',
        name: 'Item 1.2 (disabled)',
        disabled: true
      },
    ],
  },
  {
    id: '6',
    name: 'Item 2 (draggable)',
    draggable: true
  },
];


function TreeViewProgramSelect({
  selectedBranches,
  setSelectedBranches,
  schoolCode,
}: DropdownProgramSelectProps) {

  const [programms, setProgramms] = useState<TreeDataItem[]>([])

  const _q = useQuery({
    queryFn: async () => {
      const p = await getBasicProgrammes(schoolCode)

      setProgramms(p.map((programme): TreeDataItem => ({
        ...programme,
        children: Array(Number(programme.year)).fill(null).map((_, index): TreeDataItem => ({
          id: String(index + 1),
          name: String(index + 1),
          children: [],
          onClick: async () => {
            console.log("CLICK")
            const year = index + 1
            const branches = await fetchBranchesForProgramm(
                  schoolCode,
                  programme.id,
                  String(year)
                );
            const treeBranches = branches.map(({id, branchName}): TreeDataItem => ({
              id,
              name: branchName,
              selectedIcon: () => <SquareCheck />
            }))
            setProgramms((prev) =>
                prev.map((p) => {
                  if (String((p as any).id) !== String(programme.id) && !((p as any).programmeId === programme.id)) {
                    return p;
                  }

                  const newChildren = (p.children ?? []).map((child, i) =>
                    i === index ? { ...child, children: treeBranches } : child
                  );

                  return { ...p, children: newChildren };
                })
              );
          }
        }))
      })))
    },
    queryKey: ["programmes", { schoolCode: schoolCode }],
  });

  return (
    <div>
      <TreeView data={programms} onSelect={(e) => console.log(e)} />
    </div>
  )
}

export default TreeViewProgramSelect