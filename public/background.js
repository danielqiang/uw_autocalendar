let active_tab_id = 0;

chrome.tabs.onActivated.addListener(tab => {
    chrome.tabs.get(tab.tabId, current_tab_info => {
        active_tab_id = tab.tabId
        if (/^https:\/\/calendar\.google/.test(current_tab_info.url)) {
            chrome.tabs.executeScript(null, {file: './foreground.js'}, () => console.log("Injected foreground.js"));
        }
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "check check") {
        chrome.tabs.sendMessage(active_tab_id, {message: "received message"});
        chrome.storage.local.get("password", value => {
            console.log(value);
        })
    }
});
