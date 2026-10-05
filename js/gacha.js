import { getBeetles } from "./beetles.js";
import { getCards } from "./cards.js";
import { getGameState, drawCard } from "./game-state.js";
import { createCard } from "./card-view.js";

const DRAW_COST = 20;
const content = document.getElementById("gacha-content");
const message = document.getElementById("gacha-message");
const balance = document.getElementById("gacha-balance");
const distinct = document.getElementById("gacha-distinct");
const total = document.getElementById("gacha-total");
const drawButton = document.getElementById("gacha-draw");
const refreshButton = document.getElementById("gacha-refresh");
const help = document.getElementById("gacha-help");
const result = document.getElementById("gacha-result");
const resultTitle = document.getElementById("gacha-result-title");
const drawnCard = document.getElementById("gacha-drawn-card");
const collectionGrid = document.getElementById("gacha-collection-grid");
const collectionMessage = document.getElementById("gacha-collection-message");

let cards = [];
let cardsById = new Map();
let beetlesById = new Map();
let loaded = false;
let drawing = false;
let latestCardId = null;

document.getElementById("gacha-cost").textContent = String(DRAW_COST);
drawButton.textContent = `Draw a card — ${DRAW_COST} points`;

function renderOwnedCard(owned) {
  const card = cardsById.get(owned.cardId);
  const beetle = beetlesById.get(card?.beetleId);
  return createCard(card, beetle, owned.quantity);
}

function renderState(state) {
  balance.textContent = String(state.points);
  distinct.textContent = String(state.collection.length);
  total.textContent = String(state.collection.reduce(
    (sum, owned) => sum + owned.quantity, 0
  ));

  drawButton.disabled = drawing || state.points < DRAW_COST;
  refreshButton.hidden = true;
  help.textContent = state.points < DRAW_COST
    ? `You need ${DRAW_COST - state.points} more points. Earn them in the quiz.`
    : "A duplicate adds another copy to your collection.";

  collectionGrid.replaceChildren();
  state.collection.forEach(owned => collectionGrid.append(renderOwnedCard(owned)));
  collectionMessage.textContent = state.collection.length === 0
    ? "Your collection is empty. Earn points in the quiz and draw your first card."
    : "";

  const latestOwned = state.collection.find(owned => owned.cardId === latestCardId);
  drawnCard.replaceChildren();
  result.hidden = !latestOwned;

  if (latestOwned) {
    drawnCard.append(renderOwnedCard(latestOwned));
  }
}

function refreshState() {
  if (!loaded) return null;
  let state;

  try {
    state = getGameState();
  } catch (error) {
    balance.textContent = "—";
    distinct.textContent = "—";
    total.textContent = "—";
    drawButton.disabled = true;
    refreshButton.hidden = false;
    result.hidden = true;
    collectionGrid.replaceChildren();
    collectionMessage.textContent = "Your saved collection could not be read.";
    help.textContent = "Retry loading your saved progress before drawing.";
    message.textContent = "Your saved progress could not be read in this browser.";
    console.error("Could not read game progress:", error);
    return null;
  }

  renderState(state);
  message.textContent = "";
  return state;
}

drawButton.addEventListener("click", () => {
  if (!loaded || drawing) return;
  drawing = true;
  drawButton.disabled = true;
  let outcome;

  try {
    outcome = drawCard(cards, DRAW_COST);
  } catch (error) {
    drawing = false;
    const state = refreshState();

    if (state) {
      message.textContent = state.points < DRAW_COST
        ? `You need ${DRAW_COST} points to draw a card. Earn more in the quiz.`
        : "The draw could not be saved. Please try again.";
    }

    console.error("Could not complete the card draw:", error);
    return;
  }

  // The draw is already saved before updating the interface.
  drawing = false;
  latestCardId = outcome.card.id;
  renderState(outcome.state);
  const beetle = beetlesById.get(outcome.card.beetleId);
  const owned = outcome.state.collection.find(item => item.cardId === outcome.card.id);
  message.textContent = owned.quantity === 1
    ? `New card: ${beetle.commonName}. ${DRAW_COST} points spent.`
    : `You drew ${beetle.commonName} again. You now have ${owned.quantity} copies. ${DRAW_COST} points spent.`;
  resultTitle.focus();
});

refreshButton.addEventListener("click", refreshState);
window.addEventListener("pageshow", refreshState);
window.addEventListener("storage", refreshState);

async function loadGacha() {
  try {
    const [cardData, beetleData] = await Promise.all([getCards(), getBeetles()]);

    if (!Array.isArray(cardData) || cardData.length === 0 || !Array.isArray(beetleData)) {
      throw new Error("The card catalogue is invalid.");
    }

    const validSpecies = beetleData.every(beetle =>
      typeof beetle?.id === "string" && beetle.id.trim() !== "" &&
      typeof beetle.commonName === "string" && beetle.commonName.trim() !== "" &&
      typeof beetle.scientificName === "string" && beetle.scientificName.trim() !== ""
    );

    if (!validSpecies) {
      throw new Error("Species need an ID and both names.");
    }

    cardsById = new Map(cardData.map(card => [card.id, card]));
    beetlesById = new Map(beetleData.map(beetle => [beetle.id, beetle]));
    const validCards = cardData.every(card =>
      typeof card.id === "string" && card.id.trim() !== "" &&
      beetlesById.has(card.beetleId) &&
      (card.artwork == null || typeof card.artwork === "string")
    );

    if (!validCards || cardsById.size !== cardData.length || beetlesById.size !== beetleData.length) {
      throw new Error("Each card needs a unique ID and a matching species.");
    }

    cards = cardData;
    loaded = true;
    content.hidden = false;
    refreshState();
  } catch (error) {
    loaded = false;
    content.hidden = true;
    drawButton.disabled = true;
    message.textContent = "The card catalogue could not be loaded. Please reload the page.";
    console.error("Could not load the card catalogue:", error);
  }
}

loadGacha();
