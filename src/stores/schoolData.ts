import type { SchoolInfo } from "@/lib/types"

export function getSchoolInfo() {
  const jsonString = localStorage.getItem('schoolInfo')
  if(!jsonString)
    throw new Error("schoolInfo is null!")
  return JSON.parse(jsonString) as SchoolInfo
}

export  function setSchoolInfo(schoolInfo: SchoolInfo) {
  return localStorage.setItem('schoolInfo', JSON.stringify(schoolInfo))
}

export  function getServerUrl() {
  return localStorage.getItem('serverUrl')
}

export  function setServerUrl(serverUrl: string) {
  return localStorage.setItem('serverUrl', serverUrl)
}

export  function getSelectedBranches() {
  const json = localStorage.getItem('branches')
  if(!json)
    throw new Error("branches is null!")
  return JSON.parse(json) as string[]
}

export  function saveSelectedBranches(branchesIds: string[]) {
  return localStorage.setItem('branches', JSON.stringify(branchesIds))
}