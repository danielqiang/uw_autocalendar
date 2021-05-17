import { HTTPMethod, Session } from "./session.js";
import { batch_await } from "./utils.js";

export class CanvasSAMLSession extends Session {
    is_authenticating: boolean;

    async authenticate(callback: () => Promise<Response>): Promise<Promise<Response>> {
        // Only allow one failed request to open up a Canvas tab.
        if (!this.is_authenticating) {
            this.is_authenticating = true;
            window.open("https://apps.canvas.uw.edu/wayf");
        }
        return this.saml_flow(callback);
    }

    private async saml_flow(callback: () => Promise<Response>): Promise<Promise<Response>> {
        // Listen for Canvas authentication to complete before resolving the given callback.
        return new Promise((resolve) => {
            chrome.webRequest.onBeforeRequest.addListener(
                (details) => {
                    if (details.url.startsWith("https://sso.canvaslms.com")) {
                        if (this.is_authenticating) {
                            chrome.tabs.query({ active: true }, function (tabs) {
                                chrome.tabs.remove(tabs[0].id);
                            });
                        }
                        this.is_authenticating = false;
                        resolve(callback());
                    }
                },
                { urls: ["<all_urls>"] }
            );
        });
    }

    async request(
        method: HTTPMethod,
        url: string,
        init?: RequestInit
    ): Promise<Response> {
        const response = await super.request(method, url, init);

        if (response.status == 401) {
            // Authenticate with a retry of the request as the callback.
            return await this.authenticate(() => {
                return super.request(method, url, init);
            });
        } else {
            return response;
        }
    }
}

export interface CanvasCalendarEvent {
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

export interface CanvasAssignmentEvent {
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
    assignment: CanvasAssignment;
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

export interface CanvasAssignment {
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

export class CanvasAssignmentWrapper {
    canvas_assignment: CanvasAssignment;
    canvas_general_infos: CanvasAssignmentEvent;

    constructor(canvas_assignment: CanvasAssignmentEvent) {
        this.canvas_general_infos = canvas_assignment;
        this.canvas_assignment = canvas_assignment.assignment;
    }

    get due_date(): Date {
        return new Date(
            //checks in order: Assignment due date, Assignment lock date,
            // Course Assignment due date, Course Assignment lock date
            this.canvas_assignment.due_at ||
                this.canvas_assignment.lock_at ||
                this.canvas_general_infos.end_at
        );
    }
    /** Returns short description of a canvas assignment with the specified format
     *  @returns: String of pattern COURSE NAME CODE: Assignment Name.
     * */
    get title(): string {
        let desc = "";
        //Lets start by getting the course name and a colon
        if (this.canvas_general_infos.context_name){
            desc += "" + this.canvas_general_infos.context_name.split(":")[0].split("-")[0].toLowerCase().trim();
        } else if (this.canvas_assignment.course_id){
            // TODO Is there a way to look up our course ID's? We know which course is assigned which ID when we look them up in the calendar, that was moved to utils.ts though
        } else {
            console.log("ERROR");
            desc += "COURSE MISSING";
        }
        let comparison = desc.split(" ");
        //adding brackets later so it doesnt mess up our comparison array used to delete duplicate words like "chem"
        desc += "] : ";
        desc = "[" + desc
        //lets now get the assignment name and remove duplicate words from the course name
        if(this.canvas_assignment.name){
            let cleaned_name = this.canvas_assignment.name.toLowerCase()
                .split(" ").filter(e => !comparison.includes(e)).join(" ")
            desc+= cleaned_name;
        } else if (this.canvas_general_infos.title){
            let cleaned_name = this.canvas_general_infos.title.toLowerCase()
                .split(" ").filter(e => !comparison.includes(e)).join(" ")
            desc += cleaned_name;
        } else {
            console.log("ERROR");
            desc += "Assignment Name Unknown";
        }
        return desc
    }

    /**
     * Will return a string of format assignment description \n canvas URL to the assignment itself.
     */
    get full_description(): string {
        let desc = "";
        if(this.canvas_general_infos.description){
            desc+=this.canvas_general_infos.description;
        } else if (this.canvas_assignment.description){
            desc+=this.canvas_assignment.description;
        }
        if(desc){
            desc+="\n"
        }
        if (this.canvas_assignment.html_url){
            desc += this.canvas_assignment.html_url;
        }
        return desc
    }
}

export interface CanvasCourse {
    id: number;
    name: string;
    account_id: number;
    uuid: string;
    start_at: string;
    grading_standard_id?: any;
    is_public: boolean;
    created_at: string;
    course_code: string;
    default_view: string;
    root_account_id: number;
    enrollment_term_id: number;
    license: string;
    grade_passback_setting?: any;
    end_at: string;
    public_syllabus: boolean;
    public_syllabus_to_auth: boolean;
    storage_quota_mb: number;
    is_public_to_auth_users: boolean;
    homeroom_course: boolean;
    course_color?: any;
    apply_assignment_group_weights: boolean;
    calendar: CanvasCourseCalendar;
    time_zone: string;
    blueprint: boolean;
    template: boolean;
    enrollments?: CanvasEnrollmentsEntity[];
    hide_final_grades: boolean;
    workflow_state: string;
    restrict_enrollments_to_course_dates: boolean;
    overridden_course_visibility: string;
}
export interface CanvasCourseCalendar {
    ics: string;
}
export interface CanvasEnrollmentsEntity {
    type: string;
    role: string;
    role_id: number;
    user_id: number;
    enrollment_state: string;
    limit_privileges_to_course_section: boolean;
}

enum CanvasEventType {
    ASSIGNMENT = "assignment",
    EVENT = "event",
}

export default class Canvas {
    static readonly RATE_LIMIT: number = 50;
    static readonly API_URL: string = "https://canvas.uw.edu/api/v1";

    private session: CanvasSAMLSession;

    // Cache fields
    private _courses: CanvasCourse[];
    private _user_id: number;

    constructor() {
        this.session = new CanvasSAMLSession();
    }

    async user_id(): Promise<number> {
        if (this._user_id === undefined) {
            const url = Canvas.API_URL + "/users/self?include=[id]";
            const user_id = await this.session
                .get(url)
                .then((r) => r.json())
                .then((user) => user.id);
            this._user_id = user_id;
        }
        return this._user_id;
    }

    async courses(): Promise<any[]> {
        if (this._courses === undefined) {
            const params = new URLSearchParams({
                per_page: `${Number.MAX_SAFE_INTEGER}`,
            });
            const courses_url = `${Canvas.API_URL}/courses?${params}`;
            const courses = await this.session
                .get(courses_url)
                .then((r) => r.json())
                .then(courses => courses.filter(course => course.access_restricted_by_date !== true))
            this._courses = courses;
        }
        return this._courses;
    }

    async download_events(): Promise<Map<string, CanvasCalendarEvent[]>> {
        return this.download_calendar_events(CanvasEventType.EVENT);
    }

    async download_assignments(): Promise<
        Map<string, CanvasAssignmentEvent[]>
    > {
        return this.download_calendar_events(CanvasEventType.ASSIGNMENT);
    }

    private async download_calendar_events(
        event_type: CanvasEventType
    ): Promise<Map<string, any[]>> {
        let events = new Map();
        let courses = await this.courses();

        await batch_await(
            courses,
            async (course) =>
                events.set(
                    course.name,
                    await this.download_course_events(event_type, course.id)
                ),
            Canvas.RATE_LIMIT
        );

        return events;
    }

    private async download_course_events(
        event_type: CanvasEventType,
        course_id: number
    ): Promise<any[]> {
        const params = new URLSearchParams([
            ["type", event_type],
            ["context_codes[]", `user_${await this.user_id()}`],
            ["context_codes[]", `course_${course_id}`],
            ["all_events", "true"],
            ["per_page", "100"],
        ]);

        let course_events = [];
        let page_num = 1;
        let more_events = true;
        while (more_events) {
            params.set("page", String(page_num));
            let url = `${Canvas.API_URL}/calendar_events?${params}`;
            const resp = await this.session.get(url).then((r) => r.json());
            if (Array.isArray(resp) && resp.length > 0) {
                course_events = course_events.concat(resp);
            } else {
                more_events = false;
            }
            page_num += 1;
        }

        return course_events;
    }
}
