import GoogleCalendar from "./google_calendar.js";
import Canvas from "./canvas1.js";


// TODO:
//  - Write interface for Canvas event object and Canvas assignment object
//  - Write a transformer that transforms canvas objects to google calendar
const init = () => {
    const calendar = new GoogleCalendar();
    const canvas = new Canvas();

    document
        .getElementById("test-OAuth")
        .addEventListener("click", async function () {
            console.log(await calendar.session.oauth_token());
        });

    document
        .getElementById("test-download-events")
        .addEventListener("click", async function () {
            console.log(await calendar.download_events());
            //console.log(await calendar.delete_calendar("c_8sor9sf4k3boaovnprlfcnm8sg@group.calendar.google.com"))
            //const start = new Date('May 5, 2021 10:00:00')
            //const end = new Date('May 5, 2021 10:00:00')
            //const event = new GoogleCalendarEvent(start, end)
            console.log(
                await calendar.delete_event("0s9rcrri5k8ei9lt0r877itdhs")
            );
        });

    document
        .getElementById("test-Canvas")
        .addEventListener("click", async function () {
            console.log(await canvas.download_all_assignments());
            console.log(await canvas.download_all_events())

            // const events = canvas.download_all_events()
            // for (let event of events) {
            //    const google_calendar_event = to_google_calendar_event(event)
            //    google_calendar.upload_event(event)
        });
};

init();
