class GoogleCalendar {
    static DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
    static SCOPE = "https://www.googleapis.com/auth/calendar.readonly"

    constructor(client_id, api_key) {
        this.client = gapi.client.init({
            apiKey: api_key,
            clientId: client_id,
            discoveryDocs: GoogleCalendar.DISCOVERY_DOCS,
            scope: GoogleCalendar.SCOPE
        }).resolve();
    }

    signIn(){
        gapi.auth2.getAuthInstance().signIn();
    }

    signOut(){
        gapi.auth2.getAuthInstance().signOut();
    }
}


let main = () => {
    let CLIENT_ID = '770480046288-4olsqcejcdttk1gug1si4i3q3prfl2sb.apps.googleusercontent.com';
    let API_KEY = 'AIzaSyBbvcrsOEYfurUDHaki-XKqf0lUniCwRLM';

    let calendar = new GoogleCalendar(CLIENT_ID, API_KEY);
    calendar.signIn();
}

main();