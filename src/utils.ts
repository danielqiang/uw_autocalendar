export function download(content, fileName) {
    let a = document.createElement("a");
    let file = new Blob([JSON.stringify(content)], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
