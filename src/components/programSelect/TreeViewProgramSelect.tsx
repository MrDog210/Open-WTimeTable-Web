import type { DropdownProgramSelectProps } from "@/lib/types"
import { TreeView, type TreeDataItem } from "../tree-view"
import { Check } from "lucide-react";
import { getBasicProgrammes } from "@/lib/http/api";
import { useQuery } from "@tanstack/react-query";

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
          onClick: () => {
            const year = index + 1
            console.log("Clicked ", programme, year)
          }
        }))
      }))
    },
    queryKey: ["programmes", { schoolCode: schoolCode }],
  });

  return (
    <div>
      <TreeView data={programms}  />
    </div>
  )
}

export default TreeViewProgramSelect