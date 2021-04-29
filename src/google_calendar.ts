import {Session} from "./session.js";

export class GoogleOAuthSession extends Session {
    oauth_token(): Promise<string> {
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

    private async default_headers(): Promise<Headers> {
        return new Headers({
            'Authorization': 'Bearer ' + await this.session.oauth_token(),
            'Content-Type': 'application/json'
        })
    }

    async download_events(): Promise<any> {
        const url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
        const headers = await this.default_headers();
        return this.session.get(url, {headers}).then(resp => resp.json())
    }
}