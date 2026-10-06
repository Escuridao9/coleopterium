export const gameStateChangedEvent = "game-state-changed";

const storageKey = "coleopterium.game";

function validateState(state) {
  const validPoints = Number.isSafeInteger(state?.points) && state.points >= 0;
  const validCollection = Array.isArray(state?.collection) &&
    state.collection.every(item =>
      typeof item?.cardId === "string" && item.cardId.trim() !== "" &&
      Number.isSafeInteger(item.quantity) && item.quantity > 0
    );

  if (!validPoints || !validCollection) {
    throw new Error("The saved game data is invalid.");
  }

  const ids = state.collection.map(item => item.cardId);

  if (new Set(ids).size !== ids.length) {
    throw new Error("Duplicate cards must be recorded using quantity.");
  }
}

export function getGameState() {
  const saved = localStorage.getItem(storageKey);

  if (saved === null) {
    return { points: 0, collection: [] };
  }

  const state = JSON.parse(saved);
  validateState(state);
  return state;
}

function saveGameState(state) {
  validateState(state);
  localStorage.setItem(storageKey, JSON.stringify(state));
  window.dispatchEvent(new Event(gameStateChangedEvent));
}

export function addPoints(amount) {
  if (!Number.isSafeInteger(amount) || amount <= 0) {
    throw new Error("The points reward must be a positive whole number.");
  }

  const state = getGameState();
  const updatedState = { ...state, points: state.points + amount };
  saveGameState(updatedState);
  return updatedState;
}

export function drawCard(cards, cost) {
  const validPool = Array.isArray(cards) && cards.length > 0 &&
    cards.every(card => typeof card?.id === "string" && card.id.trim() !== "");

  if (!validPool) {
    throw new Error("A draw needs a valid card pool.");
  }

  if (!Number.isSafeInteger(cost) || cost <= 0) {
    throw new Error("The draw cost must be a positive whole number.");
  }

  const state = getGameState();

  if (state.points < cost) {
    throw new Error("You do not have enough points for this draw.");
  }

  const card = cards[Math.floor(Math.random() * cards.length)];
  const alreadyOwned = state.collection.some(item => item.cardId === card.id);
  const collection = alreadyOwned
    ? state.collection.map(item => item.cardId === card.id
      ? { ...item, quantity: item.quantity + 1 }
      : item)
    : [...state.collection, { cardId: card.id, quantity: 1 }];

  const updatedState = {
    ...state,
    points: state.points - cost,
    collection
  };

  // Charge the points and record the card together before reporting success.
  saveGameState(updatedState);
  return { card, state: updatedState };
}
