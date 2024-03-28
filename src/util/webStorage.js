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

export function setSelectedGroups(selectedGroups) {
  localStorage.setItem('selectedGroups', JSON.stringify(selectedGroups));
}

export function getSelectedGroups() {
  return JSON.parse(localStorage.getItem('selectedGroups'));
}