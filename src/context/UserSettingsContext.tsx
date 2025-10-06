/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

function saveSettings(settings: SavedSettings) {
  return localStorage.setItem('settings', JSON.stringify(settings))
}

function loadSettings() {
  const json = localStorage.getItem('settings')
  if(!json)
    return DEFAULT_VALUES
  const savedSettings = JSON.parse(json) as SavedSettings

  return {
    ...DEFAULT_VALUES,
    ...savedSettings
  }
}

const ThemeContext = createContext<SettingsContextType | null>(null)

export type SelectedGroups = { // key is courseId, each index is the group id
  [key: string]: string[];
}

const DEFAULT_VALUES: SavedSettings = {
  defaultTimetableView: "work_week",
  hasCompletedSetup: false,
  selectedGroups: {},
}

export function useSettings() {
  const settingsCtx = useContext(ThemeContext)

  if(settingsCtx === null)
    throw new Error("Settings ctx is null!")

  return settingsCtx
}

type SavedSettings = {
  hasCompletedSetup: boolean,
  defaultTimetableView: "day" | "work_week",
  selectedGroups: SelectedGroups
  //language: // TODO: add multiple language support
}

export interface SettingsContextType extends SavedSettings {
  isLoading: boolean
  changeSettings: (settings: Partial<SavedSettings>) => unknown
  changeSelectedGroups: (courseId: string, selectedGroups: string[]) => void
}

let didInit = false;

function UserSettingsContextProvider({children}: {children: ReactNode}) {
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<SavedSettings>(DEFAULT_VALUES)
  // TODO: move splash screen and loading block here
  useEffect(() => {
    function loadAndSetSettings() {
      const savedSettings = loadSettings()
      setSettings(savedSettings)
      setIsLoading(false)
    }
    if(!didInit) {
      didInit = true
      loadAndSetSettings()
    }
  }, [])

  function changeSettings(nevValues: Partial<SavedSettings>) {
    const newSettings: SavedSettings = {
      ...settings,
      ...nevValues
    }
    setSettings(newSettings)
    return saveSettings(newSettings)
  }

  function changeSelectedGroups(courseId: string, selectedGroups: string[]) {
    console.log("changing selected groups", selectedGroups)
    changeSettings({
      selectedGroups: {
        ...settings.selectedGroups,
        [courseId]: selectedGroups
      }
    })
    console.log(settings.selectedGroups)
  }

  const ctx: SettingsContextType = {
    isLoading,
    ...settings,
    changeSettings,
    changeSelectedGroups
  }
  
  if(isLoading)
    return <></>

  return <ThemeContext.Provider value={ctx}>{children}</ThemeContext.Provider>
}

export default UserSettingsContextProvider