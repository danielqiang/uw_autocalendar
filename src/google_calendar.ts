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
    static readonly RATE_LIMIT: number = 10;

    session: GoogleOAuthSession;

    constructor() {
        this.session = new GoogleOAuthSession();
    }

    private async default_headers(): Promise<Headers> {
        return new Headers({
            Authorization: "Bearer " + (await this.session.oauth_token()),
            "Content-Type": "application/json",
        });
    }

    async download_events(calendarId: string = "primary"): Promise<any> {
        const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;
        const headers = await this.default_headers();
        return this.session
            .get(url, { headers: headers })
            .then((resp) => resp.json());
    }

    async create_event(
        event: GoogleCalendarEvent,
        calendarId: string = "primary"
    ): Promise<any> {
        const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;
        const headers = await this.default_headers();
        const body = event.to_json();

        return this.session
            .post(url, { headers: headers, body: body })
            .then((resp) => resp.json());
    }

    async delete_event(eventId: string, calendarId: string = "primary") {
        const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`;
        const headers = await this.default_headers();

        await this.session.delete(url, { headers: headers });
    }

    async create_calendar(calendarName: string): Promise<string> {
        const url = `https://www.googleapis.com/calendar/v3/calendars`;
        const headers = await this.default_headers();
        const body = JSON.stringify({
            summary: calendarName,
        });

        const response = await this.session
            .post(url, { headers: headers, body: body })
            .then((resp) => resp.json());

        return response.id;
    }

    async delete_calendar(calendarId: string) {
        const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}`;
        const headers = await this.default_headers();

        await this.session.delete(url, { headers: headers });
    }
}
