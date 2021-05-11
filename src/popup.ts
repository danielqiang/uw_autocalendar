import GoogleCalendar, { GoogleCalendarEvent } from "./google_calendar.js";
import Canvas from "./canvas.js";


const init = () => {
    const calendar = new GoogleCalendar();
    const canvas = new Canvas();

    let service = null;

    // document
    //     .getElementById("test-download-events")
    //     .addEventListener("click", async function () {
    //         console.log(await calendar.download_events());
    //         //console.log(await calendar.delete_calendar("c_8sor9sf4k3boaovnprlfcnm8sg@group.calendar.google.com"))
    //         //const start = new Date('May 5, 2021 10:00:00')
    //         //const end = new Date('May 5, 2021 10:00:00')
    //         //const event = new GoogleCalendarEvent(start, end)
    //         console.log(
    //             await calendar.delete_event("0s9rcrri5k8ei9lt0r877itdhs")
    //         );
    //     });
    //

    document
        .getElementById("oAuth")
        .addEventListener("click", async function () {
            console.log(await calendar.session.oauth_token());
            //console.log(calendar.create_calendar("AutoCal test 4").then())
        });

    document.getElementById("canvas").addEventListener("click", function () {
        let opacity = document.getElementById("canvas-icon").style.opacity;
        if (parseInt(opacity) < 1) {
            service = "canvas";
            console.log("Choose service: " + service);
            add_icon_focus("canvas-icon", "canvas", "n-canvas");
        } else {
            console.log("Cancel service: " + service);
            service = null;
            remove_icon_focus("canvas-icon", "canvas", "n-canvas");
        }
    });

    document
        .getElementById("start-sync")
        .addEventListener("click", async function () {
            if (service == null) {
                // Pop-up window
                return;
            }

            // Start loading animation ...
            console.log("Start syncing from " + service);
            // let gcal_events: Array<GoogleCalendarEvent> = [];
            if (service === "canvas") {
                const events = await canvas.download_events();
                const assignments = await canvas.download_assignments();

                // for (let [course, course_events] of events) {
                //     console.log(course);
                //     console.log(course_events);
                //     for(let event of course_events){
                //         gcal_events.push(calendar.to_google_calendar_event(event));
                //     }
                // }

                for (let [course, course_events] of events) {
                    console.log(course);
                    console.log(course_events);
                }

                for (let [course, course_assignments] of assignments) {
                    console.log(course);
                    console.log(course_assignments);
                    // for(let event of course_assignments){
                    //     gcal_events.push(calendar.to_google_calendar_event(event));
                    // }
                }

                // Clean up the page when sync process is done
                remove_icon_focus("canvas-icon", "canvas", "n-canvas");
            }

            // Uploading to google calendar
            // let v = gcal_events.pop();
            // console.log(v);
            // await calendar.create_event(v, "c_iv7s122a2ooc2jr75g4oouiac8@group.calendar.google.com");

            // for (let event of gcal_events) {
            //     // remember to change the cal id to the cal you want to upload to.
            //     await calendar.create_event(
            //         event,
            //         "c_iv7s122a2ooc2jr75g4oouiac8@group.calendar.google.com"
            //     );
            //     console.log(event);
            // }

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

const switch_sync_button_focus = async (focused: boolean): Promise<any> => {
    if (focused) {
        // Remove focus
        document.getElementById("sync-button").style.border =
            "#e0d6f5 solid 4px";
    } else {
        // Add focus
        document.getElementById("sync-button").style.border =
            "#9c6dd1 solid 4px";
    }
};

init();
