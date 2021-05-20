const init = () => {
    let service = null;

    // Poll background to keep sync animation up to date
    const interval = setInterval(() => {
        chrome.runtime.sendMessage({ action: "check_running_status" });
    }, 500);

    document
        .getElementById("oAuth")
        .addEventListener("click", async function () {
            // await autocalendar.calendar.session.remove_token(await autocalendar.calendar.session.oauth_token())
            chrome.runtime.sendMessage({ action: "oauth" });
        });

    document.getElementById("canvas").addEventListener("click", function () {
        const selected =
            parseInt(document.getElementById("canvas-icon").style.opacity) < 1;
        if (selected) {
            console.log("Choose service: " + service);

            service = "canvas";
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
            switch (service) {
                case "canvas":
                    service = null;
                    chrome.runtime.sendMessage({ action: "sync_canvas" });
                    break;
                default:
                    console.log("No service has been chosen");
                    return;
            }
            console.log("Started syncing from " + service);
            // Start loading animation
            show_loader();
        });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "sync_canvas") {
            if (request.result) {
                // Clean up the page when sync process is done
                remove_icon_focus("canvas-icon", "canvas", "n-canvas");
                remove_sync_button_focus();
                // Stop loading animation when calendar updates are done
                hide_loader();
                console.log("Finished syncing from " + service);
            } else {
                console.log("Failed to sync from " + service);
            }
        } else if (request.action === "check_running_status") {
            if (request.result) {
                add_icon_focus("canvas-icon", "canvas", "n-canvas");
                add_sync_button_focus();
                show_loader();
            } else {
                remove_icon_focus("canvas-icon", "canvas", "n-canvas");
                remove_sync_button_focus();
                hide_loader();
                clearInterval(interval);
            }
        }
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
    document.getElementById("sync-to-calendar").style.pointerEvents = "none";
};

const hide_loader = () => {
    document.getElementById("loader").style.display = "none";
    document.getElementById("sync-to-calendar").style.display = "block";
    document.getElementById("sync-to-calendar").style.pointerEvents = "auto";
};

init();
