import * as SecureStore from "expo-secure-store";

const API_URL =
  "https://app-navigate-insights-format.trycloudflare.com"

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
      let message = "Something went wrong.";

      if (response.status === 401) {
        message = "UNAUTHORIZED";
      } 
      
      else if (response.status === 404) {
        message = "NOT_FOUND";
      } 
      
      else if (response.status === 409) {
        message = "CONFLICT";
      } 
      
      else {
        try {
          const data = JSON.parse(text);

          if (data.message) {
            message = data.message;
          }
        } catch {
          // Response wasn't JSON.
        }
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