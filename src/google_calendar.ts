import { HTTPMethod, Session } from "./session.js";

export class BatchRequest {
    url: string;
    init: RequestInit;
    private readonly body_relative_urls: string[];
    private readonly body_requests: Request[];

    private readonly BATCH_BOUNDARY = "boundary";
    private readonly BATCH_DELIMITER = "\r\n";

    constructor(url: string, init: RequestInit = {}) {
        init.headers = new Headers(init.headers);
        init.headers.set(
            "Content-Type",
            `multipart/mixed; boundary=${this.BATCH_BOUNDARY}`
        );

        this.url = url;
        this.init = init;
        this.body_relative_urls = [];
        this.body_requests = [];
    }

    add(relative_url: string, request: Request) {
        this.body_relative_urls.push(relative_url);
        this.body_requests.push(request);
    }

    async build(): Promise<Request> {
        let raw_requests: string[] = [];

        for (let i = 0; i < this.body_requests.length; i++) {
            const relative_url = this.body_relative_urls[i];
            const request = this.body_requests[i];
            const raw_request = [
                `Content-Type: application/json`,
                `Content-ID: ${i}`,
                ``,
                `${request.method} ${relative_url}`,
                ``,
                `${await request.text()}`,
                ``,
            ].join(this.BATCH_DELIMITER);
            raw_requests.push(raw_request);
        }
        // add prefix/suffix boundaries to body as well
        raw_requests = ["", ...raw_requests, this.BATCH_DELIMITER];

        const body = raw_requests.join(
            `${this.BATCH_DELIMITER}--${this.BATCH_BOUNDARY}${this.BATCH_DELIMITER}`
        );
        return new Request(this.url, {
            ...this.init,
            body: body,
        });
    }
}

export class GoogleOAuthSession extends Session {
    async oauth_token(): Promise<string> {
        return new Promise((resolve) =>
            chrome.identity.getAuthToken(
                {
                    interactive: true,
                },
                (token) => resolve(token)
            )
        );
    }

    async clear_token_cache(): Promise<void> {
        return new Promise((resolve) =>
            chrome.identity.clearAllCachedAuthTokens(resolve)
        );
    }
}

export enum CalendarTimeZone {
    US_LA = "America/Los_Angeles",
}

export class GoogleCalendarEvent {
    start: Date;
    end: Date;
    summary: string;
    description: string;
    timezone: CalendarTimeZone;

    constructor(
        start: Date,
        end: Date,
        summary?: string,
        description?: string,
        timezone: CalendarTimeZone = CalendarTimeZone.US_LA
    ) {
        this.start = start;
        this.end = end;
        this.summary = summary;
        this.description = description;
        this.timezone = timezone;
    }

    json(): string {
        const event = {
            summary: this.summary,
            description: this.description,
            start: {
                dateTime: this.start.toISOString(),
                timeZone: this.timezone,
            },
            end: {
                dateTime: this.end.toISOString(),
                timeZone: this.timezone,
            },
        };
        return JSON.stringify(event);
    }
}

export default class GoogleCalendar {
    static readonly API_URL: string = "https://www.googleapis.com/calendar/v3";
    static readonly BATCH_API_URL: string =
        "https://www.googleapis.com/batch/calendar/v3";
    static readonly RATE_LIMIT: number = 10;
    static readonly BATCH_SIZE: number = 50;

    session: GoogleOAuthSession;

    constructor() {
        this.session = new GoogleOAuthSession();
    }

    private async auth_headers(): Promise<Headers> {
        return new Headers({
            Authorization: "Bearer " + (await this.session.oauth_token()),
            "Content-Type": "application/json",
        });
    }

    async download_events(calendar_id: string): Promise<any> {
        const params = new URLSearchParams({
            maxResults: "2500"
        })
        const url = `${GoogleCalendar.API_URL}/calendars/${calendar_id}/events?${params}`;
        const headers = await this.auth_headers();
        return this.session
            .get(url, { headers: headers })
            .then((r) => r.json());
    }

    private *islice(items: any[]): Generator<any[], void, void> {
        for (let i = 0; i < items.length; i += GoogleCalendar.BATCH_SIZE) {
            yield items.slice(i, i + GoogleCalendar.BATCH_SIZE);
        }
    }

    async create_events(
        events: GoogleCalendarEvent[],
        calendar_id: string
    ): Promise<Response[]> {
        let promises = [];

        for (const event_batch of this.islice(events)) {
            const headers = new Headers({
                Authorization: "Bearer " + (await this.session.oauth_token()),
            });

            const batch_request = new BatchRequest(GoogleCalendar.BATCH_API_URL, {
                method: HTTPMethod.POST,
                headers: headers,
            });
            for (const event of event_batch) {
                const relative_url = `/calendar/v3/calendars/${calendar_id}/events`;
                const request = new Request("", {
                    method: HTTPMethod.POST,
                    body: event.json(),
                });
                batch_request.add(relative_url, request);
            }
            promises.push(this.session.post(await batch_request.build()));
        }
        return Promise.all(promises)

    }

    async delete_events(
        event_ids: string[],
        calendar_id: string
    ): Promise<void> {
        let promises = []

        for (const event_id_batch of this.islice(event_ids)) {
            const headers = new Headers({
                Authorization: "Bearer " + await this.session.oauth_token(),
            });

            const batch_request = new BatchRequest(GoogleCalendar.BATCH_API_URL, {
                method: HTTPMethod.POST,
                headers: headers,
            });

            for (const event_id of event_id_batch) {
                const relative_url = `/calendar/v3/calendars/${calendar_id}/events/${event_id}`;
                const request = new Request("", {
                    method: HTTPMethod.DELETE,
                });
                batch_request.add(relative_url, request);
            }
            promises.push(this.session.post(await batch_request.build()))
        }
        await Promise.all(promises)
    }

    async create_event(
        event: GoogleCalendarEvent,
        calendar_id: string
    ): Promise<any> {
        const url = `${GoogleCalendar.API_URL}/calendars/${calendar_id}/events`;
        const headers = await this.auth_headers();
        const body = event.json();

        return this.session
            .post(url, { headers: headers, body: body })
            .then((r) => r.json());
    }

    async delete_event(event_id: string, calendar_id: string): Promise<void> {
        const url = `${GoogleCalendar.API_URL}/calendars/${calendar_id}/events/${event_id}`;
        const headers = await this.auth_headers();

        await this.session.delete(url, { headers: headers });
    }

    async create_calendar(calendar_name: string): Promise<string> {
        const url = `${GoogleCalendar.API_URL}/calendars`;
        const headers = await this.auth_headers();
        const body = JSON.stringify({
            summary: calendar_name,
        });

        const response = await this.session
            .post(url, { headers: headers, body: body })
            .then((r) => r.json());

        return response.id;
    }

    async delete_calendar(calendar_id: string): Promise<void> {
        const url = `${GoogleCalendar.API_URL}/calendars/${calendar_id}`;
        const headers = await this.auth_headers();

        await this.session.delete(url, { headers: headers });
    }

    async delete_calendars(calendar_name: string): Promise<void> {
        let promises = [];
        // Delete all calendars with name `calendar_name`
        for await (const calendar of this.iter_calendars()) {
            if (calendar.summary === calendar_name) {
                promises.push(this.delete_calendar(calendar.id));
            }
        }
        await Promise.all(promises);
    }

    private async *iter_calendars(): AsyncGenerator<any, void, void> {
        let page_token = null;
        do {
            const params =
                page_token === null
                    ? new URLSearchParams({
                          maxResults: "250",
                      })
                    : new URLSearchParams({
                          maxResults: "250",
                          pageToken: page_token,
                      });
            const url = `${GoogleCalendar.API_URL}/users/me/calendarList?${params}`;
            const headers = await this.auth_headers();

            const response = await this.session
                .get(url, { headers: headers })
                .then((r) => r.json());
            yield* response.items;

            page_token = response.nextPageToken;
        } while (page_token != null);
    }

    async get_calendar(calendar_id: string): Promise<any> {
        const url = `${GoogleCalendar.API_URL}/calendars/${calendar_id}`;
        const headers = await this.auth_headers();

        const response = await this.session
            .get(url, { headers: headers })
            .then((r) => r.json());
        return response;
    }

    async get_calendar_id(calendar_name: string): Promise<string> {
        // Returns the id of the first calendar with a name matching `calendar_name`
        for await (const calendar of this.iter_calendars()) {
            if (calendar.summary == calendar_name) {
                return calendar.id;
            }
        }
        return null;
    }

    async clear_calendar(calendar_id: string): Promise<void> {
        const events = (await this.download_events(calendar_id)).items
        const event_ids = events.map(event => event.id)
        await this.delete_events(event_ids, calendar_id)
    }
}
