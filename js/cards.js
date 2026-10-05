export async function getCards() {
  const response = await fetch("data/cards.json");

  if (!response.ok) {
    throw new Error(`Could not load cards: ${response.status}`);
  }

  return response.json();
}