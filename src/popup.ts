import GoogleCalendar from "./google_calendar.js";
import Canvas from "./canvas.js";

const init = () => {
    const calendar = new GoogleCalendar();
    const canvas = new Canvas();

    var service = null;

    // document
    //     .getElementById("test-OAuth")
    //     .addEventListener("click", async function () {
    //         console.log(await calendar.session.oauth_token());
    //     });
    //
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
    // document
    //     .getElementById("test-Canvas")
    //     .addEventListener("click", async function () {
    //          console.log(await canvas.get_events());
    //     });

    // document
    //     .getElementById("to-Google-calendar")
    //     .addEventListener("click", async function () {
    //         window.open("https://calendar.google.com/calendar/u/0/r");
    //     });
    //
    // document
    //     .getElementById("sync-Canvas")
    //     .addEventListener("click", async function () {
    //
    //         console.log(await canvas.get_events());
    //     });

    document
        .getElementById("canvas")
        .addEventListener("click", function () {
            let opacity = document.getElementById("canvas-icon").style.opacity;
            if (parseInt(opacity) < 1) {
                service = "canvas";
                console.log("Choose service: " + service);

                remove_focus();
                document.getElementById("canvas-icon").style.opacity = "1";
                document.getElementById("canvas").style.border = "#9c6dd1 solid 4px";
                document.getElementById("n-canvas").style.color = "rgb(90, 24, 107)";
            } else {
                console.log("Cancel service: " + service);
                service = null;

                document.getElementById("canvas-icon").style.opacity = "0.5";
                document.getElementById("canvas").style.border = "#e0d6f5 solid 4px";
                document.getElementById("n-canvas").style.color = "rgba(90, 24, 107, 0.6)";
            }
        });

    document
        .getElementById("sync-button")
        .addEventListener("click", function () {
           if (service === "canvas") {
               // Canvas sync flow here
           }
        });
};

const remove_focus = () => {
    let icons = document.getElementsByClassName("icon");
};

init();
