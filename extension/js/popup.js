function getToken(callback) {
    chrome.identity.getAuthToken({
        interactive: true
    }, callback);
}

function revokeToken() {
    getToken(function (token) {
        chrome.identity.removeCachedAuthToken({
            token: token
        })
    })
}

document.getElementById("test-OAuth").addEventListener("click", function () {
    getToken(function (token) {
        console.log(token);
    });
})

document.getElementById("test-download-events").addEventListener("click", function () {
    getToken(
        function(token) {
            const headers = new Headers({
                'Authorization' : 'Bearer ' + token,
                'Content-Type': 'application/json'
            })

            const queryParams = { headers };

            fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', queryParams)
                .then((response) => response.json()) // Transform the data into json
                .then(function(data) {
                    console.log(data);
                })
        }
    )
})