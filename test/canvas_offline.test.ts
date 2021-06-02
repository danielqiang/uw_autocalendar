import Canvas, {
    CanvasAssignment,
    CanvasAssignmentEvent, CanvasAssignmentWrapper,
    CanvasCalendarEvent, CanvasEventWrapper, CanvasSAMLSession, LockInfo,
} from "../src/canvas";
import {expect, jest} from "@jest/globals";
const { window } = global;

const CanvasAssignmentMain = <CanvasAssignment> {
    id: 1,
    description: "This is an example assignment for course 1",
    due_at: "2001-01-01:00:00-00:00",
    unlock_at: "2001-01-01:00:00-00:00",
    lock_at: "2001-01-03:00:00-00:00",
    points_possible: 10,
    grading_type: null,
    assignment_group_id: null,
    grading_standard_id: null,
    created_at: "2000-01-01:00:00-00:00",
    updated_at: null,
    peer_reviews: null,
    automatic_peer_reviews: null,
    position: null,
    grade_group_students_individually: null,
    anonymous_peer_reviews: null,
    group_category_id: null,
    post_to_sis: null,
    moderated_grading: null,
    omit_from_final_grade: null,
    intra_group_peer_reviews: null,
    anonymous_instructor_annotations: null,
    anonymous_grading: null,
    graders_anonymous_to_graders: null,
    grader_count: null,
    grader_comments_visible_to_graders: null,
    final_grader_id: null,
    grader_names_visible_to_final_grader: null,
    allowed_attempts: null,
    lock_info: <LockInfo> {lock_at: "2001-00-00:00:00-00:00", can_view: true, asset_string:""},
    secure_params: null,
    course_id: 1,
    name: "Example Assignment 1",
    submission_types: null,
    has_submitted_submissions: null,
    due_date_required: null,
    max_name_length: null,
    in_closed_grading_period: null,
    user_submitted: null,
    is_quiz_assignment: null,
    can_duplicate: null,
    original_course_id: null,
    original_assignment_id: null,
    original_assignment_name: null,
    original_quiz_id: null,
    workflow_state: null,
    muted: null,
    html_url: "https://www.example_assignment_1_url.com",
    quiz_id: null,
    anonymous_submissions: null,
    published: null,
    only_visible_to_overrides: null,
    locked_for_user: null,
    lock_explanation: null,
    submissions_download_url: null,
    post_manually: null,
    anonymize_students: null,
    require_lockdown_browser: null,
}

const CanvAssignEventMain = <CanvasAssignmentEvent> {title: "Example Assignment 1",
    description: "Example Assignment 1 description",
    created_at: "2000-00-00T00:00:00.00",
    all_day: false,
    all_day_date: null,
    lock_info: {lock_at: "2001-00-00:00:00-00:00"},
    id: "EA1",
    type: "Assignment",
    assignment: CanvasAssignmentMain,
    html_url: "https://www.example_assignment_1.com",
    context_code: "Class 1",
    context_name: "Example Class 1",
    end_at: "2001-01-00:00:00-00:00",
    start_at: "2001-00-00:00:00-00:00",
    url: "https://www.example_assignment_1_url.com"}

const CanvasCalendarEventMain = <CanvasCalendarEvent> {
    id: 1,
    title: "Canvas Event 1",
    start_at: "2001-01-01T10:55:20-06:00",
    end_at: "2002-01-02T00:00:00-00:00",
    workflow_state: "",
    created_at: "1999-00-00T00:00:00.000",
    updated_at: null,
    all_day: false,
    all_day_date: null,
    comments: null,
    location_address: null,
    location_name: null,
    type: "event",
    description: "Example Canvas Event 1",
    child_events_count: 0,
    all_context_codes: "",
    context_code: "EC1",
    context_name: "Canvas Event 1",
    parent_event_id: null,
    hidden: false,
    child_events: null,
    url: "https://www.example_event_1_url.com",
    html_url: "https://www.example_event_1_url.com",
    duplicates: null
}

test("Canvas Assignment Wrapper Course Name Backups", () =>{
    let CanvAssignEvent = CanvAssignEventMain
    //lets test the course name backups, starting with default case
    let assignWrapper = new CanvasAssignmentWrapper("Example Canvas Event 1", CanvAssignEvent)
    expect(assignWrapper.title).toEqual("[example canvas event 1] : assignment")
    assignWrapper = new CanvasAssignmentWrapper("", CanvAssignEvent)
    expect(assignWrapper.title).toEqual("[" + CanvAssignEvent.context_name.toLowerCase() +"]" + " : assignment")
    //lets change to something falsy here, null gives exact same behavior, check our backups work
    CanvAssignEvent.context_name = ""
    expect(assignWrapper.title).toEqual("[COURSE MISSING]" + " : example assignment 1")
})

test ("Canvas Assignment Wrapper Assignment Title Backups", ()=>{
    //lets test the assignment name backups starting with default case
    let CanvAssignEvent = CanvAssignEventMain
    let assignWrapper = new CanvasAssignmentWrapper("Example Canvas Event 1", CanvAssignEvent)
    expect(assignWrapper.title).toEqual("[example canvas event 1] : assignment")

    CanvAssignEvent.assignment.name = ""
    assignWrapper = new CanvasAssignmentWrapper("Example Canvas Event 1", CanvAssignEvent)
    expect(assignWrapper.title).toEqual("[example canvas event 1] : "+ "assignment")

    CanvAssignEvent.title = ""
    assignWrapper = new CanvasAssignmentWrapper("Example Canvas Event 1", CanvAssignEvent)
    expect(assignWrapper.title).toEqual("[example canvas event 1] : "+ "assignment name unknown")
})

test ("Canvas Event Wrapper Course Title Backups", () => {
    let CanvCourseEvent = CanvasCalendarEventMain

    let eventWrapper = new CanvasEventWrapper("Canvas Event 1", CanvCourseEvent)
    expect(eventWrapper.title).toEqual("canvas event 1")

    eventWrapper = new CanvasEventWrapper("", CanvCourseEvent)
    expect(eventWrapper.title).toEqual(CanvCourseEvent.context_name.toLowerCase())

    eventWrapper = new CanvasEventWrapper("Another Random Title", CanvCourseEvent)
    expect(eventWrapper.title).toEqual("another random title : " + CanvCourseEvent.title.toLowerCase())
})

test ("Canvas Event Wrapper Start Date", ()=>{
    let CanvCourseEvent = CanvasCalendarEventMain
    //first check generic case
    let eventWrapper = new CanvasEventWrapper("Canvas Event 1", CanvCourseEvent)
    expect(eventWrapper.start_date).toEqual(new Date(CanvCourseEvent.start_at))
})

test ("Canvas Event Wrapper End Date", ()=>{
    let CanvCourseEvent = CanvasCalendarEventMain
    //first check generic case
    let eventWrapper = new CanvasEventWrapper("Canvas Event 1", CanvCourseEvent)
    expect(eventWrapper.end_date).toEqual(new Date(CanvCourseEvent.end_at))
})


test ("Canvas Assignment Wrapper Due Date backups", ()=>{
    let CanvCourseEvent = CanvAssignEventMain
    //first check generic case
    let eventWrapper = new CanvasAssignmentWrapper("Canvas Event 1", CanvCourseEvent)
    expect(eventWrapper.due_date).toEqual(new Date(CanvCourseEvent.assignment.due_at))
    CanvCourseEvent.assignment.due_at = ""
    eventWrapper = new CanvasAssignmentWrapper("Canvas Event 1", CanvCourseEvent)
    expect(eventWrapper.due_date).toEqual(new Date(CanvCourseEvent.assignment.lock_at))

    CanvCourseEvent.assignment.lock_at = ""
    eventWrapper = new CanvasAssignmentWrapper("Canvas Event 1", CanvCourseEvent)
    expect(eventWrapper.due_date).toEqual(new Date(CanvCourseEvent.end_at))
})
