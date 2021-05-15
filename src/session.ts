import { fetch_retry } from "./utils.js";

export enum HTTPMethod {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
}

export class Session {
    async request(
        method: HTTPMethod,
        input: RequestInfo,
        init?: RequestInit
    ): Promise<Response> {
        return fetch_retry(input, { method: method, ...init });
    }

    async get(input: RequestInfo, init?: RequestInit): Promise<Response> {
        return this.request(HTTPMethod.GET, input, init);
    }

    async post(input: RequestInfo, init?: RequestInit): Promise<Response> {
        return this.request(HTTPMethod.POST, input, init);
    }

    async delete(input: RequestInfo, init?: RequestInit): Promise<Response> {
        return this.request(HTTPMethod.DELETE, input, init);
    }
}
