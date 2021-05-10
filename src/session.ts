export enum HTTPMethod {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
}

export class Session {
    async request(
        method: HTTPMethod,
        url: string,
        params?: Record<string, string> | URLSearchParams,
        init?: RequestInit
    ): Promise<Response> {
        if (!(params instanceof URLSearchParams)) {
            params = new URLSearchParams(params);
        }
        return fetch(url + params.toString(), { method: method, ...init });
    }

    async get(
        url: string,
        params?: Record<string, string> | URLSearchParams,
        init?: RequestInit
    ): Promise<Response> {
        return this.request(HTTPMethod.GET, url, params, init);
    }

    async post(
        url: string,
        params?: Record<string, string> | URLSearchParams,
        init?: RequestInit
    ): Promise<Response> {
        return this.request(HTTPMethod.POST, url, params, init);
    }

    async delete(
        url: string,
        params?: Record<string, string> | URLSearchParams,
        init?: RequestInit
    ): Promise<Response> {
        return this.request(HTTPMethod.DELETE, url, params, init);
    }
}
