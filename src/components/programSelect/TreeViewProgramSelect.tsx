import type { DropdownProgramSelectProps } from "@/lib/types"
import { Check, SquareCheck } from "lucide-react";
import { fetchBranchesForProgramm, getBasicProgrammes } from "@/lib/http/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import TreeView, { type TreeViewItem } from "../tree-view";

const data = [
  {
    id: "1",
    name: "Root",
    type: "region",
    children: [
      {
        id: "1.1",
        name: "Folder 1",
        type: "store",
        children: [
          {
            id: "1.1.1",
            name: "Subfolder",
            type: "department",
            children: [
              { id: "1.1.1.1", name: "File 1", type: "item" },
              { id: "1.1.1.2", name: "File 2", type: "item" },
            ],
          },
        ],
      },
    ],
  },
];

function TreeViewProgramSelect({
  selectedBranches,
  setSelectedBranches,
  schoolCode,
}: DropdownProgramSelectProps) {

  const [programms, setProgramms] = useState<TreeViewItem[]>([])

  useEffect(() => {
    async function fethcP() {
      const p = await getBasicProgrammes(schoolCode)

      setProgramms(p.map((programme): TreeViewItem  => ({
        ...programme,
        type: "programme",
        children: Array(Number(programme.year)).fill(null).map((_, index): TreeViewItem => ({
          id: `${programme.id};${index}`,
          name: String(index + 1),
          children: [],
          type: "year",
          /*onClick: async () => {
            console.log("CLICK")
            const year = index + 1
            const branches = await fetchBranchesForProgramm(
                  schoolCode,
                  programme.id,
                  String(year)
                );
            const treeBranches = branches.map(({id, branchName}): TreeViewItem => ({
              id,
              name: branchName,
              type: "branch"
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
          }*/
        }))
      })))
    }

    fethcP()
  }, [])

  return (
    <div>
      <TreeView data={programms} onAction={(a) => console.log(a)} />
    </div>
  )
}

export default TreeViewProgramSelect