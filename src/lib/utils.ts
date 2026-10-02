import { saveSettings, type SavedSettings } from "@/context/UserSettingsContext"
import { saveSelectedBranches, setSchoolInfo, setServerUrl } from "@/stores/schoolData"
import { clsx, type ClassValue } from "clsx"
import type { ChangeEvent } from "react"
import { twMerge } from "tailwind-merge"
import type { SchoolInfo } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type ImportedSettings = {
  settings: SavedSettings
  schoolInfo: SchoolInfo
  serverUrl: string
  selectedBranches: string[]
}

export async function importSettings(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const imported = JSON.parse(await file.text()) as ImportedSettings
      const importedSettings = imported.settings
      const importedSchoolInfo = imported.schoolInfo
      const importedBranches = imported.selectedBranches

      setSchoolInfo(importedSchoolInfo)
      saveSelectedBranches(importedBranches)
      setServerUrl(imported.serverUrl)
      saveSettings(importedSettings)
      window.location.reload();
    } catch {
      window.alert("Could not import settings. Please select a valid .wise file.")
    } finally {
      event.target.value = ""
    }
  }