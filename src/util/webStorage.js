export function setToken(token) {
  localStorage.setItem('wtt_token', token);
}

export function getToken() {
  return localStorage.getItem('wtt_token');
}

export function getServerUrl() {
  return localStorage.getItem('wtt_server_url');
}

export function setServerUrl(url) {
  console.log("setting url: " + url)
  localStorage.setItem('wtt_server_url', url);
}

export function setStoredfirstSchoolCode(firstSchoolCode) {
  localStorage.setItem('firstSchoolCode', firstSchoolCode);
}

export function getStoredfirstSchoolCode() {
  return localStorage.getItem('firstSchoolCode');
}

export function setStoredSchoolCode(schoolCode) {
  localStorage.setItem('SchoolCode', schoolCode);
}

export function getStoredSchoolCode() {
  return localStorage.getItem('SchoolCode');
}

export function setSelectedGroups(selectedGroups) {
  console.log("Setting groups: " + JSON.stringify(selectedGroups))
  localStorage.setItem('selectedGroups', JSON.stringify(selectedGroups));
}

export function getSelectedGroups() {
  return JSON.parse(localStorage.getItem('selectedGroups'));
}

export function setSelectedProgramYearAndBranch(data) { //
  localStorage.setItem('selectedPYB', JSON.stringify(data));
}

export function getSelectedProgramYearAndBranch() {
  return JSON.parse(localStorage.getItem('selectedPYB'));
}