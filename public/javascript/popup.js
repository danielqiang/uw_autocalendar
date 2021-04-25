function login() {
    chrome.identity.getAuthToken({interactive: true}, function(token) {
        console.log(token);
    });
}

document.getElementById("test-OAuth").addEventListener("click", function() {
    login()
})
