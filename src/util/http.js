import ky from "ky";
import { PROXY_URL, URL } from '../constants/http.js'
import { USERNAME, PASSWORD } from "../constants/loginCredentials.js";
import { getServerUrl, getToken, setServerUrl, setToken } from "./webStorage.js";
import { getISODateNoTimestamp } from "./dateUtils.js";

function handleError(error) {
  console.log(error)

  throw new Error(error)
}

export async function fetchToken() {
  let json = await ky.get(PROXY_URL + URL + 'login', {
    headers: new Headers ({
      'Authorization': 'Basic ' + btoa(`${USERNAME}:${PASSWORD}`), 
      'Content-Type': 'application/json'
  })}).json().catch(handleError)

  return json.token
}

export async function fetchWithToken(url) {
  const token = getToken()

  const json = await ky.get(PROXY_URL + url, {
    headers: new Headers ({
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json'
    }),
    retry: {
      limit: 2,
      methods: ['get'],
      statusCodes: [401],
      backoffLimit: 5000
    },
    hooks: {
      beforeRetry: [
        async ({request, options, error}) => {
          console.log("Retrying")
          const token = await fetchToken()
          setToken(token)
				  request.headers.set('Authorization', `token ${token}`);
        }
      ]
    }
  }).json().catch(handleError)

  return json
}

async function fetchSchoolUrl(firstSchoolCode) { // WE NEED FERI, NOT wtt_um_feri !!!!
  let json = await fetchWithToken(URL + `url?schoolCode=${firstSchoolCode}&language=slo`)
  return json.server.replace('http://', 'https://') // FUNNY WISE
}

export async function getSchoolInfo(firstSchoolCode) { // WE NEED FERI, NOT wtt_um_feri !!!!
  firstSchoolCode = firstSchoolCode.toLowerCase()

  const serverURL = await fetchSchoolUrl(firstSchoolCode)
  setServerUrl(serverURL)

  let schoolInfo = await fetchWithToken(serverURL + `schoolCode?schoolCode=${firstSchoolCode}&language=slo`)

  return schoolInfo
}

export async function getBasicProgrammes(schoolCode) {
  const url = getServerUrl()

  const json = await fetchWithToken(url + `basicProgrammeAll?schoolCode=${schoolCode}&language=slo`)

  return json
}

export async function fetchBranchesForProgramm(schoolCode, programmeId, year) {
  const url = getServerUrl()

  const json = await fetchWithToken(url + `branchAllForProgrmmeYear?schoolCode=${schoolCode}&language=slo&programmeId=${programmeId}&year=${year}`)

  return json
}

export async function fetchGroupsForBranch(schoolCode, branchId) {
  const url = getServerUrl()

  const json = await fetchWithToken(url + `groupAllForBranch?schoolCode=${schoolCode}&language=slo&branchId=${branchId}`)

  return json
}

export async function fetchNotifications(schoolCode) { // ?????????
  const url = getServerUrl()

  const json = await fetchWithToken(url + `notificationByGroups?schoolCode=wtt_um_feri&language=slo&groupsId=87_231_640`)
  //console.log(JSON.stringify(json, null, '\t'));

  return json
}

export async function fetchLecturesForGroups(schoolCode, groups, startDate, endDate) { // groups is array { id, name }
  const url = getServerUrl()                                                     // also it seems to be inclusive of dates

  let allGroupsId = ''
  
  groups.forEach(group => {
    allGroupsId += group.id.toString() + '_'
  });
  allGroupsId = allGroupsId.slice(0, -1);

  startDate = getISODateNoTimestamp(startDate)
  endDate = getISODateNoTimestamp(endDate)
  const json = await fetchWithToken(url + `scheduleByGroups?schoolCode=${schoolCode}&dateFrom=${startDate}&dateTo=${endDate}&language=slo&groupsId=${allGroupsId}`)
  //console.log(json)
  //console.log(JSON.stringify(json, null, '\t'));

  return json
}

/*const basicPrograms = [
  {
    id: 1,
    name: 'ŠTRUMAR BU',
    year: 1
  },
  {
    id: 2,
    name: 'RIT',
    year: 2
  }
]*/