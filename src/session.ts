import { fetch_retry } from "./utils.js";

export enum HTTPMethod {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
}

export class Session {
    async request(
        method: HTTPMethod,
        url: string,
        init?: RequestInit
    ): Promise<Response> {
        return fetch_retry(url, { method: method, ...init });
    }

    async get(url: string, init?: RequestInit): Promise<Response> {
        return this.request(HTTPMethod.GET, url, init);
    }

    async post(url: string, init?: RequestInit): Promise<Response> {
        return this.request(HTTPMethod.POST, url, init);
    }

    async delete(url: string, init?: RequestInit): Promise<Response> {
        return this.request(HTTPMethod.DELETE, url, init);
    }
}
