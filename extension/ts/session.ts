export enum HTTPMethod {
    // We currently only use GET/POST requests
    GET = "GET",
    POST = "POST",
}

export class Session {
    async request(method: HTTPMethod, url: string, init?: RequestInit): Promise<object> {
        return fetch(url, {method: method, ...init})
    }

    async get(url: string, init?: RequestInit): Promise<object> {
        return this.request(HTTPMethod.GET, url, init)
    }

    async post(url: string, init?: RequestInit): Promise<object> {
        return this.request(HTTPMethod.POST, url, init)
    }
}

export abstract class AuthSession extends Session {
    abstract token(): Promise<string>
}
