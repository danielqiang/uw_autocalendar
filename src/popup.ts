import GoogleCalendar from "./google_calendar.js";
import Canvas from "./canvas.js";


const init = () => {
    const calendar = new GoogleCalendar();
    const canvas = new Canvas();

    document.getElementById("test-OAuth").addEventListener("click", async function () {
        console.log(await calendar.session.oauth_token());
    })

    document.getElementById("test-download-events").addEventListener("click", async function () {
        console.log(await calendar.download_events())
    })

    document.getElementById("test-Canvas").addEventListener("click", async function () {
        console.log(await canvas.get_ics());
    })
}

init()
