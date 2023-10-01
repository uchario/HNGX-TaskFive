document.addEventListener("DOMContentLoaded", () => {
    const startRecordingButton = document.querySelector("button.start-recording");
    const stopRecordingButton = document.querySelector("button.stop-recording");

    startRecordingButton.addEventListener("click", () => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "request_recording"}, function(response) {
                if(!chrome.runtime.lastError) {
                    console.log(response);
                } else {
                    console.log(chrome.runtime.lastError, 'error line');
                }
            });
        });
    });

    // stopRecordingButton.addEventListener("click", () => {
    //     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //         chrome.tabs.sendMessage(tabs[0].id, {action: "stopvideo"}, function(response) {
    //             if(!chrome.runtime.lastError) {
    //                 console.log(response);
    //             } else {
    //                 console.log(chrome.runtime.lastError, 'error line');
    //             }
    //         });
    //     });
    // });
});