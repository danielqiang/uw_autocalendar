const setButton = document.createElement('button');
setButton.innerText = "SET DATA";
setButton.id = "setButton";

setButton.addEventListener('click', () => {
    chrome.storage.local.set({"password": "123"});
    console.log("I set data");
});

const backendButton = document.createElement('button');
backendButton.innerText = "FOR BACKEND";
backendButton.id = "backendButton";

backendButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({message: "check check"});
    console.log("i set message");
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request.message);
})

document.querySelector('body').appendChild(setButton);
document.querySelector('body').appendChild(backendButton);