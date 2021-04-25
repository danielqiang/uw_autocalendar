function login() {
    let authUrl = "https://accounts.google.com/o/oauth2/auth"
        + '?response_type=token&client_id=' + "770480046288-4olsqcejcdttk1gug1si4i3q3prfl2sb"
        + '&scope=' + "https://www.googleapis.com/auth/calendar"
        + '&redirect_uri=' + chrome.identity.getRedirectURL("oauth2");

    console.log(`redirect uri: ${chrome.identity.getRedirectURL("oauth2")}`)

    chrome.identity.launchWebAuthFlow({'url': authUrl, 'interactive': true}, function (redirectUrl) {
        if (redirectUrl) {
            console.log(redirectUrl)
            // let parsed = parse(redirectUrl.substr(chrome.identity.getRedirectURL("oauth2").length + 1));
            // token = parsed.access_token;
            // return callback(redirectUrl); // call the original callback now that we've intercepted what we needed
        } else {
            return null;
        }
    });
}

document.getElementById("test-OAuth").addEventListener("click", function() {
    chrome.tabs.create({url: 'index.html'});
})

// addListener(function() {
//     chrome.tabs.create({url: 'index.html'});
// });