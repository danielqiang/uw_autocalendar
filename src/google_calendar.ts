import { Session } from "./session.js";

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

    async remove_token(token: string): Promise<void> {
        return new Promise((resolve) =>
            chrome.identity.removeCachedAuthToken({ token: token }, resolve)
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

    to_json(): string {
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
    static readonly RATE_LIMIT: number = 5;

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
        const url = `${GoogleCalendar.API_URL}/calendars/${calendar_id}/events`;
        const headers = await this.auth_headers();
        return this.session
            .get(url, { headers: headers })
            .then((resp) => resp.json());
    }

    async create_event(
        event: GoogleCalendarEvent,
        calendar_id: string
    ): Promise<any> {
        const url = `${GoogleCalendar.API_URL}/calendars/${calendar_id}/events`;
        const headers = await this.auth_headers();
        const body = event.to_json();

        return this.session
            .post(url, { headers: headers, body: body })
            .then((resp) => resp.json());
    }

    async delete_event(eventId: string, calendar_id: string): Promise<void> {
        const url = `${GoogleCalendar.API_URL}/calendars/${calendar_id}/events/${eventId}`;
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
            .then((resp) => resp.json());

        return response.id;
    }

    async delete_calendar(calendar_id: string): Promise<void> {
        const url = `${GoogleCalendar.API_URL}/calendars/${calendar_id}`;
        const headers = await this.auth_headers();

        await this.session.delete(url, { headers: headers });
    }

    async *iter_calendars(): AsyncGenerator<any, void, void> {
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

    async calendar_exists(calendar_name: string): Promise<boolean> {
        return (await this.get_calendar_id(calendar_name)) != null;
    }
}
