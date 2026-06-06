const SERVER_URL: string =
  import.meta.env.VITE_SERVER_URL ??
  `${window.location.protocol}//${window.location.hostname}:4000`;

const buildServerUrl = (endpoint: string) => new URL(endpoint, SERVER_URL).toString();

type ServerResponse = Record<string, unknown> & { statusCode: number };

async function requestServer<T extends ServerResponse = ServerResponse>(
  endpoint: string,
  init: RequestInit,
): Promise<T | undefined> {
  try {
    const response = await fetch(buildServerUrl(endpoint), {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
    const res = (await response.json()) as T;
    res.statusCode = response.status;
    return res;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Sends an asynchronous HTTP GET request to the specified API Gateway.
 * Returns response as JSON
 *
 * @async
 * @param {string} endpoint - The URL to which the GET request is sent.
 * @returns A Promise that resolves to the JSON response from the server.
 */
export async function requestGetServer<T extends ServerResponse = ServerResponse>(
  endpoint: string,
): Promise<T | undefined> {
  return requestServer<T>(endpoint, { method: "GET" });
}

/**
 * Sends an asynchronous HTTP PUT request to the specified API Gateway.
 * Returns response as JSON
 *
 * @async
 * @param {string} endpoint - The URL to which the PUT request is sent.
 * @param body - The body of the request, which will be sent as JSON.
 * @returns A Promise that resolves to the JSON response from the server.
 */
export async function requestPutServer<T extends ServerResponse = ServerResponse>(
  endpoint: string,
  body: unknown,
): Promise<T | undefined> {
  return requestServer<T>(endpoint, { method: "PUT", body: JSON.stringify(body) });
}

/**
 * Sends an asynchronous HTTP DELETE request to the specified API Gateway.
 * Returns response as JSON
 *
 * @async
 * @param {string} endpoint - The URL to which the PUT request is sent.
 * @param body - The body of the request, which will be sent as JSON.
 * @returns A Promise that resolves to the JSON response from the server.
 */
export async function requestDeleteServer<T extends ServerResponse = ServerResponse>(
  endpoint: string,
  body: unknown,
): Promise<T | undefined> {
  return requestServer<T>(endpoint, { method: "DELETE", body: JSON.stringify(body) });
}

/**
 * Sends an asynchronous HTTP POST request to the specified API Gateway.
 * Returns response as JSON
 *
 * @async
 * @param {string} endpoint - The URL to which the POST request is sent.
 * @param body - The body of the request, which will be sent as JSON.
 * @returns A Promise that resolves to the JSON response from the server.
 */
export async function requestPostServer<T extends ServerResponse = ServerResponse>(
  endpoint: string,
  body: unknown,
): Promise<T | undefined> {
  return requestServer<T>(endpoint, { method: "POST", body: JSON.stringify(body) });
}
