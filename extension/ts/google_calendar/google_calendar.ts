import {AuthSession} from "../session";

export class GoogleOAuthSession extends AuthSession {
    token(): Promise<string> {
        return new Promise(resolve => chrome.identity.getAuthToken({
            interactive: true
        }, success => resolve(success)))
    }
}

export default class GoogleCalendar {
    session: GoogleOAuthSession

    constructor() {
        this.session = new GoogleOAuthSession();
    }

    async download_events() {
        const url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
        return this.session.get(url)
    }
}