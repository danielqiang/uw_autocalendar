import { Session } from "./session.js";
import { CanvasAssignment } from "./canvas.js";
import { CanvasEvent } from "./canvas.js";
import { LockInfo } from "./canvas.js";
import { EventAssignment } from "./canvas.js";

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
}

export enum CalendarTimeZone {
    US_LA = "America/Los_Angeles",
}

export class GoogleCalendarEvent {
    summary: string;
    description: string;
    start: Date;
    end: Date;
    timezone: CalendarTimeZone;

    constructor(
        start: Date,
        end: Date,
        timezone: CalendarTimeZone = CalendarTimeZone.US_LA,
        summary?: string,
        description?: string
    ) {
        this.start = start;
        this.end = end;
        this.timezone = timezone;
        this.summary = summary;
        this.description = description;
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

    async create_calendar(calendarName: string): Promise<any> {
        const url = `https://www.googleapis.com/calendar/v3/calendars`;
        const headers = await this.default_headers();
        const body = JSON.stringify({
            summary: calendarName,
        });

        return this.session
            .post(url, { headers: headers, body: body })
            .then((resp) => resp.json());
    }

    async delete_calendar(calendarId: string) {
        const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}`;
        const headers = await this.default_headers();

        await this.session.delete(url, { headers: headers });
    }

    to_google_calendar_event(
        event: CanvasEvent | CanvasAssignment
    ): GoogleCalendarEvent {
        let start = null;
        let end = null;
        let title = null;
        let description = null;
        if (event.type === "event") {
            title = event.title;
            description = event.description;
            start = new Date(event.start_at);
            end = new Date(event.end_at);
        } else if (event.type === "assignment") {
            //let assignment = <EventAssignment> event.assignment;
            title = event.title;
            description = event.html_url.concat(" ", event.description);
            // if(assignment.due_at != null){
            //     start = new Date(assignment.due_at);
            //     end = new Date(assignment.due_at);
            // }else{
            //     start = new Date(assignment.lock_at);
            //     end = new Date(assignment.lock_at);
            // }
            start = new Date(event.start_at);
            end = new Date(event.end_at);
        }
        return new GoogleCalendarEvent(
            start,
            end,
            CalendarTimeZone.US_LA,
            title,
            description
        );
    }
}
