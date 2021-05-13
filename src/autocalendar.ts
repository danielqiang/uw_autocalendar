import GoogleCalendar, { GoogleCalendarEvent } from "./google_calendar.js";
import Canvas, {
    CanvasAssignmentEvent,
    CanvasCalendarEvent,
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
        let calendar_id = await this.calendar.get_calendar_id(calendar_name);
        if (calendar_id) {
            await this.calendar.delete_calendar(calendar_id);
        }
        calendar_id = await this.calendar.create_calendar(calendar_name);

        let events: GoogleCalendarEvent[] = [];

        for (const course_events of (
            await this.canvas.download_events()
        ).values()) {
            course_events.forEach((e) =>
                events.push(this.event_to_calendar_event(e))
            );
        }

        for (const course_assignments of (
            await this.canvas.download_assignments()
        ).values()) {
            course_assignments.forEach((e) =>
                events.push(this.assignment_to_calendar_event(e))
            );
        }

        await batch_await(
            events,
            (event) => this.calendar.create_event(event, calendar_id),
            GoogleCalendar.RATE_LIMIT
        );
    }

    private assignment_to_calendar_event(
        assignment: CanvasAssignmentEvent
    ): GoogleCalendarEvent {
        return new GoogleCalendarEvent(
            new Date(assignment.assignment.due_at),
            new Date(assignment.assignment.due_at),
            assignment.title,
            assignment.description
        );
    }

    private event_to_calendar_event(
        event: CanvasCalendarEvent
    ): GoogleCalendarEvent {
        return new GoogleCalendarEvent(
            new Date(event.start_at),
            new Date(event.end_at),
            event.title,
            event.description
        );
    }
}