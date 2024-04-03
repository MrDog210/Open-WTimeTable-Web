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

export function setStoredSchoolCode(firstSchoolCode, schoolCode) {
  localStorage.setItem(`SchoolCode${firstSchoolCode}`, schoolCode);
}

export function getStoredSchoolCode(firstSchoolCode) {
  return localStorage.getItem(`SchoolCode${firstSchoolCode}`);
}

export function storeSelectedGroups(firstSchoolCode, selectedGroups) {
  localStorage.setItem(`selectedGroups${firstSchoolCode}`, JSON.stringify(selectedGroups));
}

export function getSelectedGroups(firstSchoolCode) {
  return JSON.parse(localStorage.getItem(`selectedGroups${firstSchoolCode}`));
}

export function setSelectedProgramYearAndBranch(firstSchoolCode, data) { //
  localStorage.setItem(`selectedPYB${firstSchoolCode}`, JSON.stringify(data));
}

export function getSelectedProgramYearAndBranch(firstSchoolCode) {
  return JSON.parse(localStorage.getItem(`selectedPYB${firstSchoolCode}`));
}

export function getLastTimetableView() {
  return localStorage.getItem(`lastTTView`);
}

export function setLastTimetableView(view) {
  localStorage.setItem(`lastTTView`, view);
}

export function clearStorage() {
  localStorage.clear()
}