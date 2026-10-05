/* Video controls */

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

/* Search controls */

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search");
const beetleCards = document.querySelectorAll(".beetle-card");
const searchMessage = document.getElementById("search-message");

searchForm.addEventListener("submit", event => {
  event.preventDefault();

  const searchTerm = searchInput.value.trim().toLowerCase();
  let matchingCards = 0;

  beetleCards.forEach(card => {
    const cardText = card.textContent.toLowerCase();
    const matchesSearch = cardText.includes(searchTerm);

    card.hidden = !matchesSearch;

    if (matchesSearch) {
      matchingCards++;
    }
  });

  if (matchingCards === 0) {
    searchMessage.textContent =
      "No beetles found. Try another common or scientific name.";
  } else {
    searchMessage.textContent = "";
  }
});