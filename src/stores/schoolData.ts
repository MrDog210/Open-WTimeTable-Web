import type { GroupBranchChild, SchoolInfo } from "@/lib/types"

export async function getUrlSchoolCode() {
  return localStorage.getItem('UrlSchoolCode')
}

export async function setUrlSchoolCode(schoolCode: string) {
  return localStorage.setItem('UrlSchoolCode', schoolCode)
}

export function getSchoolInfo() {
  const jsonString = localStorage.getItem('schoolInfo')
  if(!jsonString)
    throw new Error("schoolInfo is null!")
  return JSON.parse(jsonString) as SchoolInfo
}

export async function setSchoolInfo(schoolInfo: SchoolInfo) {
  return localStorage.setItem('schoolInfo', JSON.stringify(schoolInfo))
}

export async function getServerUrl() {
  return localStorage.getItem('serverUrl')
}

export async function setServerUrl(serverUrl: string) {
  return localStorage.setItem('serverUrl', serverUrl)
}

export async function getAllStoredBranchGroups() {
  const json = localStorage.getItem('groups')
  if(!json)
    throw new Error("groups is null!")
  return JSON.parse(json) as GroupBranchChild[]
}

export async function setAllBranchGroups(groups: GroupBranchChild[]) {
  return localStorage.setItem('groups', JSON.stringify(groups))
}