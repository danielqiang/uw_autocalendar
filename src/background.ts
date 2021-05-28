(async () => {
    const AutoCalendar = (
        await import(chrome.extension.getURL("js/autocalendar.js"))
    ).default;

    const calendar_name = "AutoCalendar Demo";
    const autocalendar = new AutoCalendar();

    let prev_execution = new Date(0);
    let sync_complete = true;

    const send_message_to_popup = (action: string, result: boolean) => {
        chrome.runtime.sendMessage({
            action: action,
            complete: result
        });
    };

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

                    sync_complete = false;
                    prev_execution = new Date();
                    await autocalendar.sync_canvas(calendar_name).catch((err) => {
                        console.log(`Error occurs during sync process: ${err}`);
                        send_message_to_popup(request.action, false);
                    });
                    sync_complete = true;

                    console.timeEnd("sync_canvas");
                } else {
                    console.log(
                        `Click too fast, please try in ${
                            60 - time_since_prev_execution
                        } seconds`
                    );
                }
                send_message_to_popup(request.action, true);
            } else if (request.action === "check_sync_status") {
                send_message_to_popup(request.action, sync_complete);
            }
        }
    );
})();
