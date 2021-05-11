import GoogleCalendar, { GoogleCalendarEvent } from "./google_calendar.js";
import Canvas, {
    CanvasCalendarEvent,
    CanvasAssignmentEvent,
} from "./canvas.js";
import { batch_await } from "./utils.js";

class AutoCalendar {
    calendar: GoogleCalendar;
    canvas: Canvas;

    constructor() {
        this.calendar = new GoogleCalendar();
        this.canvas = new Canvas();
    }

    async sync_canvas(calendar_name: string) {
        const calendar_id = await this.calendar.create_calendar(calendar_name);

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
            new Date(assignment.assignment.unlock_at),
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

const init = () => {
    const autocalendar = new AutoCalendar();

    let service = null;

    document
        .getElementById("oAuth")
        .addEventListener("click", async function () {
            // await autocalendar.calendar.session.remove_token(await autocalendar.calendar.session.oauth_token())
            console.log(await autocalendar.calendar.session.oauth_token());
        });

    document.getElementById("canvas").addEventListener("click", function () {
        let opacity = document.getElementById("canvas-icon").style.opacity;
        if (parseInt(opacity) < 1) {
            service = "canvas";
            console.log("Choose service: " + service);
            add_icon_focus("canvas-icon", "canvas", "n-canvas");
            add_sync_button_focus();
        } else {
            console.log("Cancel service: " + service);
            service = null;
            remove_icon_focus("canvas-icon", "canvas", "n-canvas");
            remove_sync_button_focus();
        }
    });

    document
        .getElementById("sync-to-calendar")
        .addEventListener("click", async function () {
            if (service == null) {
                console.log("No service has been chosen");
                return;
            }

            console.log("Started syncing from " + service);
            // Start loading animation
            show_loader();

            if (service === "canvas") {
                await autocalendar.sync_canvas("AutoCalendar Demo");
                // console.log(await autocalendar.canvas.download_events());
                // console.log(await autocalendar.canvas.download_assignments());
            }

            // Stop loading animation when calendar updates are done
            hide_loader();

            // Clean up the page when sync process is done
            remove_icon_focus("canvas-icon", "canvas", "n-canvas");
            remove_sync_button_focus();
            console.log("Finished syncing from " + service);
            service = null;

            // Stop animation ...
            console.log("Finish syncing from " + service);
        });
};

const add_icon_focus = (icon: string, service: string, s_name: string) => {
    document.getElementById(icon).style.opacity = "1";
    document.getElementById(service).style.border = "#9c6dd1 solid 4px";
    document.getElementById(s_name).style.color = "rgb(90, 24, 107)";
};

const remove_icon_focus = (icon: string, service: string, s_name: string) => {
    document.getElementById(icon).style.opacity = "0.5";
    document.getElementById(service).style.border = "#e0d6f5 solid 4px";
    document.getElementById(s_name).style.color = "rgba(90, 24, 107, 0.6)";
};

const add_sync_button_focus = () => {
    document.getElementById("sync-button").style.border =
        "rgba(90, 24, 107, 0.6) solid 2px";
    document.getElementById("sync-button").style.boxShadow =
        "1px 2px rgb(70, 24, 60, 0.85)";
    document.getElementById("sync-to-calendar").style.color = "rgb(60, 14, 50)";
};

const remove_sync_button_focus = () => {
    document.getElementById("sync-button").style.border = "#e0d6f5 solid 2px";
    document.getElementById("sync-button").style.boxShadow =
        "1px 2px rgba(70, 24, 60, 0.4)";
    document.getElementById("sync-to-calendar").style.color =
        "rgba(70, 24, 60, 0.5)";
};

const show_loader = () => {
    document.getElementById("sync-to-calendar").style.display = "none";
    document.getElementById("loader").style.display = "block";
};

const hide_loader = () => {
    document.getElementById("loader").style.display = "none";
    document.getElementById("sync-to-calendar").style.display = "block";
};

init();
