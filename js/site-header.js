import { getGameState, gameStateChangedEvent } from "./game-state.js";

const pointsValue = document.getElementById("site-points-value");
const pointsMessage = document.getElementById("site-points-message");
const navigationLinks = document.querySelectorAll(".site-nav a");

// Species entries belong to the encyclopedia section.
const currentPage = window.location.pathname.split("/").pop() || "index.html";
const currentSection = currentPage === "entry.html" ? "index.html" : currentPage;

navigationLinks.forEach(link => {
  const isCurrent = link.getAttribute("href") === currentSection;
  link.classList.toggle("is-current", isCurrent);

  if (isCurrent) {
    link.setAttribute("aria-current", currentPage === "entry.html" ? "true" : "page");
  } else {
    link.removeAttribute("aria-current");
  }
});

function refreshPoints() {
  try {
    const state = getGameState();
    pointsValue.textContent = state.points.toLocaleString("en-GB");
    pointsMessage.textContent = "";
  } catch (error) {
    pointsValue.textContent = "—";
    pointsMessage.textContent = "Your saved points are currently unavailable.";
    console.error("Could not read the header points:", error);
  }
}

refreshPoints();
window.addEventListener(gameStateChangedEvent, refreshPoints);
window.addEventListener("pageshow", refreshPoints);
window.addEventListener("storage", refreshPoints);
