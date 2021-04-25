function login() {
    chrome.identity.getAuthToken({interactive: true}, function(token) {
        console.log(token);
    });
}

login()