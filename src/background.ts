(async () => {
    const AutoCalendar = (
        await import(chrome.extension.getURL("js/autocalendar.js"))
    ).default;
    const Canvas = (
        await import(chrome.extension.getURL("js/canvas.js"))
    ).default;

    const calendar_name = "AutoCalendar Demo";
    const autocalendar = new AutoCalendar();
    const canvas = new Canvas();

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "oauth") {
            autocalendar.calendar.session.oauth_token();
        } else if (request.action === "list_canvas_courses") {
            canvas.courses()
                .then(r => canvas.get_course_names(r))
                .then(r => sendResponse({course_list: r}));
            return true;
        } else if (request.action === "sync_canvas") {
            console.time("sync_canvas");

            // TODO Only sync courses with id contained in request.course_list
            autocalendar.sync_canvas(calendar_name).then(() => {
                console.timeEnd("sync_canvas");
                sendResponse();
            });
            return true;
        }
    });
})();