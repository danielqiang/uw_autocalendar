import { Session } from "./session.js";

export interface CanvasAssignment {
    id: number;
    title: string;
    start_at: string;
    end_at: string;
    workflow_state: string;
    created_at: string;
    updated_at: string;
    all_day: boolean;
    all_day_date?: any;
    comments?: any;
    location_address?: any;
    location_name: string;
    type: string;
    description: string;
    child_events_count: number;
    all_context_codes: string;
    context_code: string;
    context_name: string;
    parent_event_id?: any;
    hidden: boolean;
    child_events?: any[];
    url: string;
    html_url: string;
    duplicates?: any[];
}

export interface CanvasEvent {
    title: string;
    description: string;
    workflow_state: string;
    created_at: string;
    updated_at: string;
    all_day: boolean;
    all_day_date: string;
    lock_info: LockInfo;
    id: string;
    type: string;
    assignment: EventAssignment;
    html_url: string;
    context_code: string;
    context_name: string;
    end_at: string;
    start_at: string;
    url: string;
}

export interface LockInfo {
    lock_at: string;
    can_view: boolean;
    asset_string: string;
}

export interface EventAssignment {
    id: number;
    description: string;
    due_at: string;
    unlock_at: string;
    lock_at: string;
    points_possible: number;
    grading_type: string;
    assignment_group_id: number;
    grading_standard_id?: any;
    created_at: string;
    updated_at: string;
    peer_reviews: boolean;
    automatic_peer_reviews: boolean;
    position: number;
    grade_group_students_individually: boolean;
    anonymous_peer_reviews: boolean;
    group_category_id?: any;
    post_to_sis: boolean;
    moderated_grading: boolean;
    omit_from_final_grade: boolean;
    intra_group_peer_reviews: boolean;
    anonymous_instructor_annotations: boolean;
    anonymous_grading: boolean;
    graders_anonymous_to_graders: boolean;
    grader_count: number;
    grader_comments_visible_to_graders: boolean;
    final_grader_id?: any;
    grader_names_visible_to_final_grader: boolean;
    allowed_attempts: number;
    lock_info?: LockInfo;
    secure_params: string;
    course_id: number;
    name: string;
    submission_types?: string[];
    has_submitted_submissions: boolean;
    due_date_required: boolean;
    max_name_length: number;
    in_closed_grading_period: boolean;
    user_submitted: boolean;
    is_quiz_assignment: boolean;
    can_duplicate: boolean;
    original_course_id?: any;
    original_assignment_id?: any;
    original_assignment_name?: any;
    original_quiz_id?: any;
    workflow_state: string;
    muted: boolean;
    html_url: string;
    quiz_id: number;
    anonymous_submissions: boolean;
    published: boolean;
    only_visible_to_overrides: boolean;
    locked_for_user: boolean;
    lock_explanation: string;
    submissions_download_url: string;
    post_manually: boolean;
    anonymize_students: boolean;
    require_lockdown_browser: boolean;
}

export default class Canvas {
    session: Session;
    url: string;
    MAX: number = Number.MAX_SAFE_INTEGER - 1;
    constructor() {
        this.session = new Session();
        this.url = "https://canvas.uw.edu/api/v1/";
    }

    /** check_login_auth will redirect the user to make an API call from canvas, requiring authentication.
     * In the scenario that user does not have authorized cookies this function returns false
     * and user will be automatically be redirected to UW login portal where they input their pass and save cookies.
     * If user successfully navigates to canvas.uw.edu.* without redirect or error (code 200) this function returns true
     *
     * Note: user without auth cookies will be asked to login, however this function is not able to recognize when
     * the user successfully connects to canvas AFTER the initial attempt
     * (this requires communication between
     * foreground and background scripts, very hard)
     * Therefore the user must open the chrome extension again,
     * with the auth cookie now generated, and kick off the flow.
     *
     * @returns boolean: whether or not the user has auth cookies for canvas and is able to query the API,
     * true for yes, false otherwise
     */
    async check_login_auth(): Promise<boolean> {
        return await this.session.get(this.url + "courses").then((resp) => {
            // Session unable to query the API, send them to canvas.uw.edu to login and obtain auth cookies.
            if (resp.status != 200) {
                window.open("https://canvas.uw.edu");
            } else if (resp.status == 200) {
                // User successfully queries the canvas API, user has the required auth cookies, return true.
                return true;
            }
            return false;
        });
    }

    /**
     * get_ics() will attempt to query a users canvas information using existing cookies, if user does not have auth
     * cookies get_ics will return null, otherwise will return a readableStream attached to the .ics file for a
     * currently enrolled class belonging to the user.
     *
     * How is "currently enrolled" determined? Currently enrolled is based on the listed start date of the course
     * on the canvas API. If the start date of the course is less than *13* weeks from the current date, the course
     * is considered currently enrolled. We chose 13 weeks because fall quarter is abnormally long,
     * unexpected behavior created by this may include multiple quarter's events being returned by get_ics().
     *
     * @returns null if user does not have auth cookies, else array of readable streams,
     * one per course, attached to the calendar .ics file for the course
     *
     **/
    async get_events(): Promise<Map<string, CanvasEvent[]>> {
        const is_authenticated = await this.check_login_auth();
        if (!is_authenticated) {
            return null;
        }

        let course_to_events_dict = new Map();
        let user_id = await this.get_user_id();
        let user_courses = await this.get_course_ids_and_names();
        for (let course_id of Object.keys(user_courses)) {
            course_to_events_dict.set(
                user_courses[course_id],
                await this.download_events(user_id, course_id)
            );
        }
        return course_to_events_dict;
    }

    async get_assignments(): Promise<Map<string, CanvasAssignment[]>> {
        if (!(await this.check_login_auth())) {
            return null;
        }

        let course_to_events_dict = new Map();
        let user_id = await this.get_user_id();
        let user_courses = await this.get_course_ids_and_names();
        for (let course_id of Object.keys(user_courses)) {
            course_to_events_dict.set(
                user_courses[course_id],
                await this.download_assignments(user_id, course_id)
            );
        }
        return course_to_events_dict;
    }

    async get_user_id(): Promise<any> {
        const url = this.url + "users/self?include=[id]";
        let user_profile = await this.session.get(url).then((r) => r.json());
        return user_profile.id;
    }

    async get_course_ids_and_names(): Promise<any> {
        let course_id_to_name = {};
        // This is a super rough way of looking 13 weeks in the past. The reason we need to do this is because
        // we can not rely on profs to mark their class as finished upon completion in the canvas system therefore
        // we filter classes by those who have started in the past 13 weeks.
        let thirteen_weeks_ago = new Date(
            new Date().getTime() - 1000 * 60 * 60 * 24 * 7 * 13
        );

        await this.session
            .get(this.url + "courses" + "?per_page=" + this.MAX)
            .then((resp) => resp.json())
            .then((resp) => {
                let course_data = resp;
                for (let course_index in course_data) {
                    let course = course_data[course_index];
                    // Get course starting date.
                    let date = new Date(course["start_at"]);
                    if (date >= thirteen_weeks_ago) {
                        course_id_to_name[course.id] = course.name;
                    }
                }
            });
        return course_id_to_name;
    }

    async download_all_course_events(
        user_id: String,
        course_id: String
    ): Promise<any> {
        const assignment_url =
            this.url +
            "calendar_events?type=assignment&context_codes%5B%5D=user_" +
            user_id +
            "&context_codes%5B%5D=course_" +
            course_id +
            "&all_events=true&per_page=" +
            this.MAX;
        const event_url =
            this.url +
            "calendar_events?type=event&context_codes%5B%5D=user_" +
            user_id +
            "&context_codes%5B%5D=course_" +
            course_id +
            "&all_events=true&per_page=" +
            this.MAX;
        const assignments = await this.session
            .get(assignment_url)
            .then((r) => r.json());
        const events = await this.session.get(event_url).then((r) => r.json());
        return assignments.concat(events);
    }

    async download_assignments(
        user_id: string,
        course_id: string
    ): Promise<CanvasAssignment[]> {
        const assignment_url =
            this.url +
            "calendar_events?type=assignment&context_codes%5B%5D=user_" +
            user_id +
            "&context_codes%5B%5D=course_" +
            course_id +
            "&all_events=true&per_page=" +
            this.MAX;
        const assignments = await this.session
            .get(assignment_url)
            .then((r) => r.json());
        return assignments;
    }

    async download_events(
        user_id: string,
        course_id: string
    ): Promise<CanvasEvent[]> {
        const event_url =
            this.url +
            "calendar_events?type=event&context_codes%5B%5D=user_" +
            user_id +
            "&context_codes%5B%5D=course_" +
            course_id +
            "&all_events=true&per_page=" +
            this.MAX;
        const events = await this.session.get(event_url).then((r) => r.json());
        return events;
    }
}
