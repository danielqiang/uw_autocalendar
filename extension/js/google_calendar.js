export class GoogleCalendar {
    oauth_token() {
        return new Promise(resolve => chrome.identity.getAuthToken({
            interactive: true
        }, success => resolve(success)))
    }

    async get(url) {
        const headers = new Headers({
            'Authorization': 'Bearer ' + await this.oauth_token(),
            'Content-Type': 'application/json'
        })
        return fetch(url, {headers}).then(resp => resp.json())
    }

    async download_events() {
        const url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
        return this.get(url)
    }
}