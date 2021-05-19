import GoogleCalendar, { GoogleCalendarEvent } from "./google_calendar.js";
import Canvas, {
    CanvasAssignmentEvent, CanvasAssignmentWrapper,
    CanvasCalendarEvent, CanvasEventWrapper,
} from "./canvas.js";
import { batch_await } from "./utils.js";

export default class AutoCalendar {
    calendar: GoogleCalendar;
    canvas: Canvas;

    constructor() {
        this.calendar = new GoogleCalendar();
        this.canvas = new Canvas();
    }

    async sync_canvas(calendar_name: string) {
        // let calendar_id = await this.calendar.get_calendar_id(calendar_name);
        // if (calendar_id) {
        //     await this.calendar.delete_calendar(calendar_id);
        // }
        let calendar_id = await this.calendar.create_calendar(calendar_name);

        const results = await Promise.all([
            this.canvas.download_events(),
            this.canvas.download_assignments(),
        ]);
        const canvas_course_events = results[0];
        const canvas_course_assignments = results[1];

        let events: GoogleCalendarEvent[] = [];

        for (const [course, course_events] of canvas_course_events) {
            course_events.forEach((e) =>
                events.push(this.event_to_calendar_event(course, e))
            );
        }

        for (const [course, course_assignments] of canvas_course_assignments) {
            course_assignments.forEach((e) =>
                events.push(this.assignment_to_calendar_event(course, e))
            );
        }

        let batched_events = [];
        for (let i = 0; i < events.length; i += GoogleCalendar.BATCH_SIZE) {
            batched_events.push(events.slice(i, i + GoogleCalendar.BATCH_SIZE));
        }
        await batch_await(
            batched_events,
            (batch) => this.calendar.create_events(batch, calendar_id),
            GoogleCalendar.RATE_LIMIT
        );
    }

    private assignment_to_calendar_event(
        course: string,
        assignment: CanvasAssignmentEvent
    ): GoogleCalendarEvent {
        let wrapper = new CanvasAssignmentWrapper(course, assignment)
        return new GoogleCalendarEvent(
            wrapper.due_date,
            wrapper.due_date,
            wrapper.title,
            wrapper.full_description
        );
    }

    private event_to_calendar_event(
        course: string,
        event: CanvasCalendarEvent
    ): GoogleCalendarEvent {
        let wrapper = new CanvasEventWrapper(course, event)
        return new GoogleCalendarEvent(
            wrapper.start_date,
            wrapper.end_date,
            wrapper.title,
            wrapper.full_description
        );
    }
}
