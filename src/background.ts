// chrome.webRequest.onBeforeRequest.addListener(
//     (details) => {
//         if (details.url.startsWith("https://sso.canvaslms.com")) {
//             chrome.tabs.query({ active: true }, function (tabs) {
//                 chrome.tabs.remove(tabs[0].id);
//             });
//         }
//     },
//     { urls: ["<all_urls>"] }
// );
