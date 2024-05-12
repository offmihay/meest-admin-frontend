const BASE_URL: string = "https://meest-back-e18db4f449d7.herokuapp.com";
// const BASE_URL: string = "http://localhost:3000/api";

export async function fetchJson(url: string, token?: string): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response: Response = await fetch(`${BASE_URL}/${url}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Error response from server");
  }

  return await response.json();
}

export async function postJson(
  url: string,
  payload: any,
  token?: string
): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response: Response = await fetch(`${BASE_URL}/${url}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Error response from server");
  }

  return await response.json();
}
