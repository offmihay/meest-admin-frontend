const BASE_URL: string = "https://meest-back-e18db4f449d7.herokuapp.com";
// const BASE_URL: string = "http://localhost:3000";

export async function fetchJson(url: string): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/${url}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Error response from server");
  }

  return await response.json();
}

export async function postJson(url: string, payload: object): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/${url}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Error response from server");
  }

  return await response.json();
}


// export async function sendJson(req: {
//   url: string;
//   method: "GET" | "POST";
//   urlParams?: Record<string, string>;
//   payload?: object;
// }): Promise<any> {
//   //
// }

// export async function getJson(url: string, urlParams?: Record<string, string>) {
//   return sendJson({ url, urlParams, method: "GET" });
// }

// export async function postJson2(
//   url: string,
//   payload?: object,
//   urlParams?: Record<string, string>
// ) {
//   return sendJson({ url, urlParams, payload, method: "POST" });
// }
