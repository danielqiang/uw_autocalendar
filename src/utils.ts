export function download(content, fileName) {
    let a = document.createElement("a");
    let file = new Blob([JSON.stringify(content)], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function batch_await(
    items: any[],
    to_promise: Function,
    batch_size: number
) {
    for (let i = 0; i < items.length; i += batch_size) {
        let promises = [];
        items
            .slice(i, i + batch_size)
            .forEach((item) => promises.push(to_promise(item)));
        await Promise.all(promises);
    }
}

export function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function fetch_retry(
    url: string,
    init?: RequestInit,
    retries: number = 3,
    exponential_delay: number = 500
) {
    // fetch with retries and exponential backoff
    return fetch(url, init).then(async function (resp) {
        if (resp.status >= 400 && retries > 0) {
            console.log(
                `Request to ${resp.url} failed with status code ${resp.status}. Retrying...`
            );

            return await wait(exponential_delay).then(() =>
                fetch_retry(url, init, retries - 1, exponential_delay * 2)
            );
        } else {
            return resp;
        }
    });
}
