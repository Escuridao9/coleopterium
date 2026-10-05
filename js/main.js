/* Video controls */

const heroVideo = document.getElementById("hero-video");
const videoToggle = document.getElementById("video-toggle");

videoToggle.addEventListener("click", () => {
  if (heroVideo.paused) {
    heroVideo.play().catch((error) => {
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
const searchMessage = document.getElementById("search-message");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const beetleCards = document.querySelectorAll(".beetle-card");

  const searchTerm = searchInput.value.trim().toLowerCase();
  let matchingCards = 0;

  beetleCards.forEach((card) => {
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

/* Fetch the data of beetles */

async function loadBeetles() {
  try {
    const response = await fetch("data/beetles.json");

    if (!response.ok) {
      throw new Error(`Could not load beetles: ${response.status}`);
    }

    const beetles = await response.json();

    renderBeetles(beetles);
  } catch (error) {
    searchMessage.textContent =
      "The catalogue could not be loaded. Please reload the page.";
    console.error("Could not load the beetle catalogue:", error);
  }
}

loadBeetles();

function renderBeetles(beetles) {
  const grid = document.querySelector(".beetle-grid");
  const template = document.getElementById("beetle-card-template");

  grid.replaceChildren();

  beetles.forEach((beetle) => {
    const card = template.content.cloneNode(true);
    const image = card.querySelector("img");

    image.src = beetle.image;
    image.alt = beetle.imageAlt;

    card.querySelector("h3").textContent = beetle.commonName;
    card.querySelector("i").textContent = beetle.scientificName;

    grid.append(card);
  });
}
