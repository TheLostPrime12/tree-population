type _BaseNetworkHandlerArgs = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path?: string;
  queryParams?: Record<string, any>;
};

export type NetworkHandlerArgs = _BaseNetworkHandlerArgs &
  Omit<RequestInit, keyof _BaseNetworkHandlerArgs>;

// TODO write test cases for this handler.
// Maybe we'll just move to React Query. We'll see.
export default class NetworkRequestHandler {
  private _baseUrl: string;

  constructor({ baseUrl }: { baseUrl: string }) {
    this._baseUrl = baseUrl;
  }

  async handle<T>(args: NetworkHandlerArgs) {
    let { path, queryParams, ...rest } = args;

    path ??= "";
    if (path && path[0] != "/") path += "/";

    queryParams ??= {};
    let paramString = "";
    for (const key of Object.keys(queryParams)) {
      const value = queryParams[key];
      if (!paramString) paramString += "?";
      if (value) {
        paramString += `&${key}=${value}`;
      }
    }

    const response = await fetch(this._baseUrl + path + paramString, rest);

    //TODO foundation: network error handling and propagation.

    const result = await response.json();

    return result as T;
  }
}
