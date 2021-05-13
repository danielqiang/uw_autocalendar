import AutoCalendar from "./autocalendar.js";

const init = () => {
    const calendar_name = "AutoCalendar Demo";
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
                chrome.runtime.sendMessage({ action: "sync_canvas" });
                // chrome.runtime.getBackgroundPage(
                //     backgroundPage => backgroundPage.testfunc()
                // )

                // await autocalendar.sync_canvas(calendar_name);
                // await autocalendar.calendar.session.clear_token_cache()
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
