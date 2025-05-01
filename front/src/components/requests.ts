const SERVER_URL: string | undefined = import.meta.env.VITE_SERVER_URL;

if (!SERVER_URL) {
  console.error("SERVER_URL missing from environment")
}

/**
 * Sends an asynchronous HTTP GET request to the specified API Gateway.
 * Returns response as JSON
 *
 * @async
 * @param {string} endpoint - The URL to which the GET request is sent.
 * @returns {Promise<any>} A Promise that resolves to the JSON response from the server.
 */
export async function requestGetServer(endpoint: string): Promise<any> {
  const url = SERVER_URL + endpoint;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        // @ts-ignore: I don't care
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    res.statusCode = response.status;
    return res;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Sends an asynchronous HTTP PUT request to the specified API Gateway.
 * Returns response as JSON
 *
 * @async
 * @param {string} endpoint - The URL to which the PUT request is sent.
 * @param {any} body - The body of the request, which will be sent as JSON.
 * @returns {Promise<any>} A Promise that resolves to the JSON response from the server.
 */
export async function requestPutServer(endpoint: string, body: any): Promise<any> {
  const url = SERVER_URL + endpoint;
  try {
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        // @ts-ignore: I don't care
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    res.statusCode = response.status;
    return res;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Sends an asynchronous HTTP DELETE request to the specified API Gateway.
 * Returns response as JSON
 *
 * @async
 * @param {string} endpoint - The URL to which the PUT request is sent.
 * @param {any} body - The body of the request, which will be sent as JSON.
 * @returns {Promise<any>} A Promise that resolves to the JSON response from the server.
 */
export async function requestDeleteServer(endpoint: string, body: any): Promise<any> {
  const url = SERVER_URL + endpoint;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      body: JSON.stringify(body),
      headers: {
        // @ts-ignore: I don't care
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    res.statusCode = response.status;
    return res;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Sends an asynchronous HTTP POST request to the specified API Gateway.
 * Returns response as JSON
 *
 * @async
 * @param {string} endpoint - The URL to which the POST request is sent.
 * @param {any} body - The body of the request, which will be sent as JSON.
 * @returns {Promise<any>} A Promise that resolves to the JSON response from the server.
 */
export async function requestPostServer<T>(endpoint: string, body: any): Promise<T | undefined> {
  const url = SERVER_URL + endpoint;
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        // @ts-ignore: I don't care
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    res.statusCode = response.status;
    return res;
  } catch (error) {
    console.log(error);
  }
}
