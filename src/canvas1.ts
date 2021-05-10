import { Session } from "./session.js";

export default class Canvas {
    session: Session;
    _user_id: string;

    readonly _URL_PREFIX: string = "https://canvas.uw.edu/api/v1/";
    readonly _USER_ID_URL: string =
        this._URL_PREFIX + "users/self?include=[id]";
    readonly _COURSES_URL: string = this._URL_PREFIX + "courses";
    readonly _ASSIGNMENTS_URL: string =
        this._URL_PREFIX + "calendar_events?type=assignment";
    readonly _EVENTS_URL: string =
        this._URL_PREFIX + "calendar_events?type=event";

    constructor() {
        this.session = new Session();

    }

    async user_id() {
        if (this._user_id === undefined) {
            this._user_id = await this.session
                .get(this._USER_ID_URL)
                .then((r) => r.json())
                .then((user) => user.id);
        }
        return this._user_id;
    }

    async is_logged_in(): Promise<boolean> {
        const response = await this.session.get(this._COURSES_URL);
        return response.status === 200;
    }

    async login(): Promise<boolean> {
        window.open("https://canvas.uw.edu");

        // TODO: check if user successfully logged in
        return true;
    }

    /**
     * Map course id -> course name
     */
    async courses(): Promise<Record<string, string>> {
        let courses = {}

        const course_data = await this.session.get(this._COURSES_URL).then(r => r.json());
        for (const course of course_data.values()) {
            courses[course.id] = course.name
        }
        return courses
    }


    async download_all_assignments(): Promise<any> {
        if (!await this.is_logged_in()) {
            return null
        }

        let assignments = {}
        for (const course_id of Object.keys(await this.courses())) {
            assignments[course_id] = await this.download_assignments(course_id)
        }
        return assignments
    }

    async download_all_events(): Promise<any> {
        if (!await this.is_logged_in()) {
            return null
        }

        let events = {}
        for (const course_id of Object.keys(await this.courses())) {
            events[course_id] = await this.download_events(course_id)
        }
        return events
    }

    async download_assignments(course_id: String): Promise<any> {
        const assignment_url =
            this._ASSIGNMENTS_URL +
            "&context_codes%5B%5D=user_" +
            (await this.user_id()) +
            "&context_codes%5B%5D=course_" +
            course_id +
            "&all_events=true";
        const assignments = await this.session
            .get(assignment_url)
            .then((r) => r.json());
        return assignments;
    }

    async download_events(course_id: String): Promise<any> {
        const event_url =
            this._EVENTS_URL +
            "&context_codes%5B%5D=user_" +
            (await this.user_id()) +
            "&context_codes%5B%5D=course_" +
            course_id +
            "&all_events=true";
        const events = await this.session.get(event_url).then((r) => r.json());
        return events;
    }
}
