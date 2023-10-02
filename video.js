const TRANSCRIBE_VIDEO = `https://codebee.pythonanywhere.com/api/video/${localStorage.getItem("videoId")}/`;

async function getVideo() {
   try {
      const response = await fetch(TRANSCRIBE_VIDEO);
      if(!response.ok) {
         console.log('transcribe video response not okay');
         throw new Error('Something went wrong');
      }
      const data = await response.json();
      console.log(data, 'video data gotten');

      localStorage.setItem("videoTitle", data.video_title);
      localStorage.setItem("videoFile", data.video_file);
      localStorage.setItem("videoTranscript", data.video_transcript);
   } catch(e) {
      console.log(e, 'error message')
   }
}

getVideo();

document.addEventListener("DOMContentLoaded", () => {
   const videoTitleEl = document.querySelector(".name-title");
   videoTitleEl.innerHTML = localStorage.getItem("videoTitle");

   const videoURLEl = document.getElementById("url-input");
   videoURLEl.value = localStorage.getItem("videoFile");

   const videoTransEl = document.querySelector(".transcript-box");
   videoTransEl.innerHTML = localStorage.getItem("videoTranscript");

   const video = document.getElementsByTagName("video")[0];
   const sources = video.getElementsByTagName("source");
   sources[0].src = localStorage.getItem("videoFile");
   video.load();
});