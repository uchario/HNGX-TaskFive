console.log("I have been injected");

var recorder = null;

let SESSION_ID;

const START_SESSION = `http://codebee.pythonanywhere.com/api/start-session/`;

async function onAccessApproved(stream) {
    const chunks = [];
    recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    recorder.start(2000);

    try {
        const response = await fetch(START_SESSION, 
        {
            method: 'POST'
        });
        if(!response.ok) {
            console.log('start session response not okay');
            throw new Error('Something went wrong');
        }
        const data = await response.json();
        SESSION_ID = data.session_id;
        console.log(data, 'session variable set', SESSION_ID);
    } catch(e) {
        console.log(e, 'error message')
    }

    recorder.onstop = async function(e) {
        // stream.getTracks().forEach(function(track) {
        //     if(track.readyState === "live") {
        //         track.stop();
        //     }
        // })
        const blob = new Blob(chunks, {type: 'video/webm', codecs:'vp8, vorbis'});
        console.log(blob, chunks);
        let formData = new FormData();
        formData.append("video_title", `Title ${SESSION_ID}`);
        formData.append("deferred", "true");

        try {
            const response = await fetch(`https://codebee.pythonanywhere.com/api/complete-session/${SESSION_ID}/`, 
                {
                    method: 'POST',
                    body: formData
                });
            if(!response.ok) {
                console.log('complete session response not okay');
                throw new Error('Something went wrong');
            }
            const data = await response.json();
            console.log(data, 'complete session response successful');
            localStorage.setItem("videoId", data.data.id);
        } catch(e) {
            console.log(e, 'complete session error message')
        }
    
        window.open('video.html', '_blank');
    }

    recorder.ondataavailable = async function(event) {
        let recordedBlob = event.data;
        let formData = new FormData();
        formData.append("video_chunk", recordedBlob);
        console.log(recordedBlob, formData);
        // chunks.push(recordedBlob);

        try {
            const response = await fetch(`http://codebee.pythonanywhere.com/api/upload-chunk/${SESSION_ID}/`, 
                {
                    method: 'POST',
                    body: formData
                });
            if(!response.ok) {
                console.log('chunk upload response not okay');
                throw new Error('Something went wrong');
            }
            console.log('chunk upload response successful')
        } catch(e) {
            console.log(e, 'chunk upload error message')
        }
        // let url = URL.createObjectURL(recordedBlob);

        // let a = document.createElement("a");
        // a.style.display = "none";
        // a.href = url;
        // a.download = "helpmeout.webm";
        // document.body.appendChild(a);
        // a.click();
        
        // document.body.removeChild(a);
        // URL.revokeObjectURL(url);
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.action === "request_recording") {
        console.log("requesting recording");
        sendResponse(`Processed: ${message.action}`);

        navigator.mediaDevices.getDisplayMedia({
            audio: true,
            video: {
                width: 999999999,
                height: 999999999
            },
            selfBrowserSurface: 'include'
        }).then((stream) => {
            onAccessApproved(stream);
        });
    }

    if(message.action === "stopvideo") {
        console.log("stopping video");
        sendResponse(`Processed: ${message.action}`);
        if(!recorder) {
            return console.log("no recorder");
        }
    }
});