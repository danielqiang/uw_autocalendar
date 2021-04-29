import GoogleCalendar from "../google_calendar.js";


const init = () => {
    const calendar = new GoogleCalendar();

    document.getElementById("test-OAuth").addEventListener("click", async function() {
        console.log(await calendar.session.token());
    })

    document.getElementById("test-download-events").addEventListener("click", async function() {
        console.log(await calendar.download_events())
    })

    document.getElementById("test-Canvas").addEventListener("click", async function() {
        console.log("hello world");
    })
}

init()
