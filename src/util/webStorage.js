export function setToken(token) {
  localStorage.setItem('wtt_token', token);
}

export function getToken() {
  return localStorage.getItem('wtt_token');
}

export function setServerUrl(url) {
  localStorage.setItem('wtt_server_url', url);
}

export function getServerUrl() {
  return localStorage.getItem('wtt_server_url');
}