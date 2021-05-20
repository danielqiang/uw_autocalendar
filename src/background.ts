(async () => {
    const AutoCalendar = (
        await import(chrome.extension.getURL("js/autocalendar.js"))
    ).default;

    const calendar_name = "AutoCalendar Demo";
    const autocalendar = new AutoCalendar();

    let prev_execution = new Date(0);
    let isRunning = false;

    chrome.runtime.onMessage.addListener(
        async (request, sender, sendResponse) => {
            const time_since_prev_execution = Math.ceil(
                (new Date().getTime() - prev_execution.getTime()) / 1000
            );

            if (request.action === "oauth") {
                await autocalendar.calendar.session.oauth_token();
            } else if (request.action === "sync_canvas") {
                if (time_since_prev_execution >= 60) {
                    console.time("sync_canvas");

                    isRunning = true;
                    prev_execution = new Date();
                    await autocalendar.sync_canvas(calendar_name);
                    isRunning = false;

                    console.timeEnd("sync_canvas");
                } else {
                    console.log(
                        `Click too fast, please try in ${
                            60 - time_since_prev_execution
                        } seconds`
                    );
                }
                chrome.runtime.sendMessage({
                    action: request.action,
                    result: true,
                });
            } else if (request.action === "check_running_status") {
                chrome.runtime.sendMessage({
                    action: request.action,
                    result: isRunning,
                });
            }
        }
    );
})();
