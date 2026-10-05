export async function getBeetles() {
  const response = await fetch("data/beetles.json");

  if (!response.ok) {
    throw new Error(`Could not load beetles: ${response.status}`);
  }

  return response.json();
}