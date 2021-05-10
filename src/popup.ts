import GoogleCalendar from "./google_calendar.js";
import Canvas from "./canvas.js";

const init = () => {
    const calendar = new GoogleCalendar();
    const canvas = new Canvas();

    var service = null;

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
        });

    document
        .getElementById("canvas")
        .addEventListener("click", function () {
            let opacity = document.getElementById("canvas-icon").style.opacity;
            if (parseInt(opacity) < 1) {
                service = "canvas";
                console.log("Choose service: " + service);

                document.getElementById("canvas-icon").style.opacity = "1";
                document.getElementById("canvas").style.border = "#9c6dd1 solid 4px";
                document.getElementById("n-canvas").style.color = "rgb(90, 24, 107)";
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

            if (service === "canvas") {
                console.log(await canvas.get_events());

                // Clean up the page when sync process is done
                remove_icon_focus("canvas-icon", "canvas", "n-canvas");
            }

            // Stop animation ...
            console.log("Finish syncing from " + service);
        });
};

const remove_icon_focus = (icon: string, service: string, name: string) => {
    document.getElementById(icon).style.opacity = "0.5";
    document.getElementById(service).style.border = "#e0d6f5 solid 4px";
    document.getElementById(name).style.color = "rgba(90, 24, 107, 0.6)";
};

const switch_sync_button_focus = async (focused: boolean): Promise<any> => {
    if (focused) {
        // Remove focus
        document.getElementById("sync-button").style.border = "#e0d6f5 solid 4px";
    } else {
        // Add focus
        document.getElementById("sync-button").style.border = "#9c6dd1 solid 4px";
    }
};

// Test purpose only
const sleep = async (milliseconds: number): Promise<any> => {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
};

init();
