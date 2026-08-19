import * as SecureStore from "expo-secure-store";

const API_URL =
  "https://accepted-minority-servers-recently.trycloudflare.com";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const accessToken =
    await SecureStore.getItemAsync("accessToken");

  const headers = new Headers(options.headers);

  headers.set(
    "Content-Type",
    "application/json"
  );

  if (accessToken) {
    headers.set(
      "Authorization",
      `Bearer ${accessToken}`
    );
  }

  const url = `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  console.log("API REQUEST:", url);
  console.log("METHOD:", options.method ?? "GET");

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log(
      "API RESPONSE STATUS:",
      response.status
    );

    const text = await response.text();

    console.log(
      "API RESPONSE BODY:",
      text
    );

    if (!response.ok) {
      if (response.status === 401) {
          throw new Error("UNAUTHORIZED");
      }

      let message = "Something went wrong.";

      try {
          const data = JSON.parse(text);

          if (data.message) {
              message = data.message;
          }
      } 
      
      catch {
          // Response wasn't JSON.
      }

      throw new Error(message);
  }

    return text
      ? JSON.parse(text)
      : ({} as T);

  } 
  
  catch (error) {
    console.error(
      "API REQUEST FAILED:",
      error
    );

    throw error;
  }
}