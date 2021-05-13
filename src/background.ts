(async () => {
    const AutoCalendar = (
        await import(chrome.extension.getURL("js/autocalendar.js"))
    ).default;

    const calendar_name = "AutoCalendar Demo";
    const autocalendar = new AutoCalendar();

    chrome.webRequest.onBeforeRequest.addListener(
        (details) => {
            if (details.url.startsWith("https://sso.canvaslms.com")) {
                chrome.tabs.query({ active: true }, function (tabs) {
                    chrome.tabs.remove(tabs[0].id);
                });
            }
        },
        { urls: ["<all_urls>"] }
    );

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "sync_canvas") {
            autocalendar.sync_canvas(calendar_name);
        }
    });
})();
