const redirect_button = document.getElementById("to-Google-calendar");
console.log(redirect_button);
if (redirect_button) {
    redirect_button.addEventListener('click', function () {
        window.open("https://calendar.google.com/calendar/u/0/r", '_black');
    });
} else {
    console.log("The redirect button is broken.");
}

