(async () => {
    const AutoCalendar = (
        await import(chrome.extension.getURL("js/autocalendar.js"))
    ).default;

    const calendar_name = "AutoCalendar Demo";
    const autocalendar = new AutoCalendar();

    chrome.runtime.onMessage.addListener(
        async (request, sender, sendResponse) => {
            if (request.action === "sync_canvas") {
                console.time("sync_canvas");
                await autocalendar.sync_canvas(calendar_name);
                console.timeEnd("sync_canvas");
            } else if (request.action == "oauth") {
                await autocalendar.calendar.session.oauth_token();
            }
        }
    );
})();