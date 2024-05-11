const BASE_URL: string = "http://localhost:3000";

export async function fetchJson(url: string, options: RequestInit): Promise<any> {
  const response: Response = await fetch(`${BASE_URL}/${url}`, options);
  if (!response.ok) {
    throw new Error("Error response from server");
  }
  return await response.json();
}

export async function postJson(url: string, payload: any): Promise<any> {
  return fetchJson(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
