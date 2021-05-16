import { HTTPMethod, Session } from "./session.js";
import { batch_await } from "./utils.js";

export class CanvasSAMLSession extends Session {
    async is_authenticated(): Promise<boolean> {
        const url = `${Canvas.API_URL}/courses`;
        const response = await this.get(url);
        return response.status === 200;
    }

    async authenticate(): Promise<boolean> {
        // Should be synchronous with a provided callback. The `return Promise(..., onSuccess=...)`
        // pattern is what transforms it into an async flow, but the
        // authentication block itself is synchronous.

        // return new Promise((resolve) => {
        //     this.saml_flow(resolve);
        // });

        window.open("https://apps.canvas.uw.edu/wayf");
        return true;
    }

    private async saml_flow(callback: () => void) {
        const load_handler = function () {
            const observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (
                        document.location.href.startsWith(
                            "https://canvas.uw.edu"
                        )
                    ) {
                        window.removeEventListener("load", load_handler);
                        callback();
                    }
                });
            });
            observer.observe(document.querySelector("body"), {
                childList: true,
                subtree: true,
            });
        };
        window.addEventListener("load", load_handler);
        window.open("https://apps.canvas.uw.edu/wayf");
    }

    async request(
        method: HTTPMethod,
        url: string,
        init?: RequestInit
    ): Promise<Response> {
        const response = await super.request(method, url, init);
        return response;

        // TODO: The auth flow should look something more like this, i.e. when an API call fails,
        //  we authenticate (authenticate() should "block" until authentication is complete) then
        //  retry the request. For now, request() just calls super.request().

        // if (response.status >= 400) {
        //     await this.authenticate();
        //     return super.request(method, url, init);
        // } else {
        //     return response;
        // }
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
// TODO: @Arik This is probably a good way of adding custom getters with specific logic;
//  just make wrapper classes for the interfaces and add
//  methods with the `get` modifier. Feel free to add whatever methods you need,
//  I've added two that we will probably need as an example.

export class CanvasAssignmentWrapper {
    canvas_assignment: CanvasAssignment;

    constructor(canvas_assignment: CanvasAssignment) {
        this.canvas_assignment = canvas_assignment;
    }

    get due_date(): Date {
        // TODO (example implementation, replace with what makes sense)
        return new Date(
            this.canvas_assignment.due_at ||
                this.canvas_assignment.lock_at ||
                this.canvas_assignment.unlock_at
        );
    }

    get full_description(): string {
        // TODO
        return null;
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
            const courses_url = `${Canvas.API_URL}/courses`;
            const courses = await this.session
                .get(courses_url)
                .then((r) => r.json());
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
        if (!(await this.session.is_authenticated())) {
            await this.session.authenticate();
        }

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
    ): Promise<any> {
        const params = new URLSearchParams([
            ["type", event_type],
            ["context_codes[]", `user_${await this.user_id()}`],
            ["context_codes[]", `course_${course_id}`],
            ["all_events", "true"],
            ["per_page", `${Number.MAX_SAFE_INTEGER}`],
        ]);
        const url = `${Canvas.API_URL}/calendar_events?${params}`;

        const course_events = await this.session.get(url).then((r) => r.json());
        return course_events;
    }
}
