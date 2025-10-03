import { API_URL, PASSWORD, USERNAME } from "@/lib/constants";


type FetchTokenResponse = {
  token: string
}

export async function fetchToken() {
  const response = await fetch(`${API_URL}login`, {
    headers:  {
      'Authorization': 'Basic ' + btoa(`${USERNAME}:${PASSWORD}`), 
      'Content-Type': 'application/json'
    }
  });

  if(!response.ok) {
    console.log(JSON.stringify(response))
    throw new Error('Failed to fetch data')
  }

  const json = (await response.json()) as FetchTokenResponse

  return json.token
}

async function storeToken(token: string) {
  return localStorage.setItem('wtt_token', token)
}

export async function getToken() {
  const token = localStorage.getItem('wtt_token');

  if(token) {
    const base64Strings = token.split('.')
    const payload = JSON.parse(atob(base64Strings[1])) as unknown as { exp: number}
    const nowInSeconds = Math.floor(Date.now() / 1000);

    if(nowInSeconds < payload.exp - 60) // check if it expired
      return token
    console.log("TOKEN HAS EXPIRED!")
  }

  const newToken = await fetchToken()
  storeToken(newToken)
  return newToken
}