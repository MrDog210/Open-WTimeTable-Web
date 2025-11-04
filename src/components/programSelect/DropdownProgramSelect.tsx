import {
  MultiSelect,
  type MultiSelectOption,
} from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchBranchesForProgramm, getBasicProgrammes } from "@/lib/http/api";
import type { DropdownProgramSelectProps, Programme } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function DropdownProgramSelect({
  selectedBranches,
  setSelectedBranches,
  schoolCode,
}: DropdownProgramSelectProps) {
  const [selectedProgramme, setSelectedProgramme] = useState<
    Programme | undefined
  >(undefined);
  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    undefined
  );

  const { data: programms } = useQuery({
    initialData: [],
    queryFn: () => getBasicProgrammes(schoolCode),
    queryKey: ["basicProgrammes", { schoolCode: schoolCode }],
  });

  const { data: branches } = useQuery({
    initialData: [],
    //queryFn: () =>  fetchBranchesForProgramm(schoolCode, selectedProgramme?.id!, selectedYear!),
    queryFn: async () => {
      const b = await fetchBranchesForProgramm(
        schoolCode,
        selectedProgramme?.id ?? "",
        selectedYear!
      );
      return b.map(
        (branch): MultiSelectOption => ({
          value: branch.id,
          label: branch.branchName,
        })
      );
    },
    queryKey: [
      "branchesForProgamme",
      {
        schoolCode: schoolCode,
        chosenProgrammID: selectedProgramme?.id,
        chosenYear: selectedYear,
      },
    ],
    enabled: !!selectedProgramme && !!selectedYear,
  });

  return (
    <div className="gap-4 flex flex-col">
      <h2>Select program</h2>
      <Select
        value={selectedProgramme?.id}
        onValueChange={(selectedP) => {
          setSelectedProgramme(programms.find((p) => p.id === selectedP)!);
          setSelectedYear(undefined);
          setSelectedBranches([]);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a program" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {programms.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <h2>Select year</h2>
      <Select
        disabled={!selectedProgramme}
        value={selectedYear}
        onValueChange={(v) => {
          setSelectedYear(v);
          setSelectedBranches([]);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a year" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {[
              ...Array(Number(!selectedProgramme ? 0 : selectedProgramme.year)),
            ].map((_, i) => (
              <SelectItem key={i} value={String(i + 1)}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <h2>Select branches</h2>
      <MultiSelect // TODO: fix overflow on long labels
        className="max-h-60 overflow-y-auto"
        disabled={!selectedProgramme && !selectedYear}
        options={branches}
        value={selectedBranches}
        onValueChange={setSelectedBranches}
      />
    </div>
  );
}

export default DropdownProgramSelect;
