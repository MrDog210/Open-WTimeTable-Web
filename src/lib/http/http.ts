import { getToken } from "@/stores/token";
import { HTTP_PROXY } from "../constants";

export async function get<T>(url: string, token?: string) {
  const headers = token ? {
    Authorization: `Bearer ${token}`,
  } : undefined

  const response = await fetch(`${HTTP_PROXY}${url}`, {
    headers: headers
  });

  if(!response.ok) {
    console.log(JSON.stringify(response))
    throw new Error('Failed to fetch data')
  }

  return (await response.json()) as T
}

export async function getWithToken<T>(url: string) {
  const token = await getToken();
  return get<T>(url, token)
}

