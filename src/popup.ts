const init = () => {
    let service = null;
    let course_list = new Set();

    document
        .getElementById("oAuth")
        .addEventListener("click", async function () {
            // await autocalendar.calendar.session.remove_token(await autocalendar.calendar.session.oauth_token())
            chrome.runtime.sendMessage({ action: "oauth" });
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
        .getElementById("start-to-sync")
        .addEventListener("click", async function () {
            if (service === null) {
                console.log("No service has been chosen");
                return;
            }

            if (service === "canvas") {
                // Fetch course titles from Canvas
                chrome.runtime.sendMessage({ action: "list_canvas_courses"}, async r => {
                    await append_course_list(r.course_list);
                    document.getElementById("calendar-button").innerHTML = "Sync to Calendar";
                    document.getElementById("sync-to-calendar").style.pointerEvents = "auto";
                    document.getElementById("course-list").style.display = "block";
                });
            }
        });

    document
        .getElementById("close-course-list")
        .addEventListener("click", function () {
            document.getElementById("course-list").style.display = "none";
        })

    document
        .querySelectorAll("input[type=checkbox]").forEach(course_checkbox => {
            course_checkbox.addEventListener("click", function () {
                this.checked = this.checked !== true;
            });
    })

    document
        .getElementById("sync-to-calendar")
        .addEventListener("click", async function () {
            if (service == null) {
                console.log("Sync is in process");
                return;
            }
            console.log("Start syncing from " + service);
            show_loader();
            service = null;

            document.querySelectorAll("input[type=checkbox]:checked")
                .forEach(checked_course => {
                course_list.add(checked_course.id);
            });
            console.log(course_list);

            chrome.runtime.sendMessage({action: "sync_canvas", course_list: Array.from(course_list).join(' ')},
                () => {
                // Clean up the page when sync process is done
                hide_loader();
                course_list.clear();
                remove_icon_focus("canvas-icon", "canvas", "n-canvas");
                remove_sync_button_focus();
            });
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
    document.getElementById("sync-button-container").style.border =
        "rgba(90, 24, 107, 0.6) solid 2px";
    document.getElementById("sync-button-container").style.boxShadow =
        "1px 2px rgba(70, 24, 60, 0.85)";
    document.getElementById("start-to-sync").style.color = "rgb(60, 14, 50)";
};

const remove_sync_button_focus = () => {
    document.getElementById("sync-button-container").style.border = "#e0d6f5 solid 2px";
    document.getElementById("sync-button-container").style.boxShadow =
        "1px 2px rgba(70, 24, 60, 0.4)";
    document.getElementById("start-to-sync").style.color =
        "rgba(70, 24, 60, 0.5)";
};

const append_course_list = async (course_list : Array<string>) => {
    let list = document.getElementById("course-name-list");
    course_list.forEach(course => {
        list.innerHTML +=
            '<div class="course-name"> <label>' +
            '<input type="checkbox" class="check-course" id='+ course[0] + '>' +
            course[1] + '</label></div>';
    });
}

const show_loader = () => {
    document.getElementById("sync-to-calendar").style.display = "none";
    document.getElementById("loader").style.display = "block";
};

const hide_loader = () => {
    document.getElementById("loader").style.display = "none";
    document.getElementById("calendar-button").innerHTML = "Sync is finished";
    document.getElementById("sync-to-calendar").style.pointerEvents = "none";
    document.getElementById("sync-to-calendar").style.display = "block";
};

init();
