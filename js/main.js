const heroVideo = document.getElementById("hero-video");
const videoToggle = document.getElementById("video-toggle");

videoToggle.addEventListener("click", () => {
  if (heroVideo.paused) {
    heroVideo.play().catch(error => {
      console.error("Video could not play:", error);
    });
  } else {
    heroVideo.pause();
  }
});

function updateVideoButton() {
  if (heroVideo.paused) {
    videoToggle.textContent = "Play video";
  } else {
    videoToggle.textContent = "Pause video";
  }
}

heroVideo.addEventListener("play", updateVideoButton);
heroVideo.addEventListener("pause", updateVideoButton);

updateVideoButton();