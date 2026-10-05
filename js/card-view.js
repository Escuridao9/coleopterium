export function createCard(card, beetle, quantity) {
  const template = document.getElementById("collectible-card-template");
  const fragment = template.content.cloneNode(true);
  const image = fragment.querySelector(".card-image");
  const placeholder = fragment.querySelector(".card-art-placeholder");
  const name = fragment.querySelector(".card-name");
  const scientificName = fragment.querySelector(".card-scientific-name");
  const entryLink = fragment.querySelector(".card-entry-link");
  const credit = fragment.querySelector(".card-photo-credit");
  const photoSource = fragment.querySelector(".card-photo-source");
  const photoLicense = fragment.querySelector(".card-photo-license");

  fragment.querySelector(".card-copy-count").textContent =
    `${quantity} ${quantity === 1 ? "copy" : "copies"}`;

  function showUnavailableImage() {
    image.hidden = true;
    placeholder.hidden = false;
    credit.hidden = true;
  }

  if (!card || !beetle) {
    name.textContent = "Previously collected card";
    scientificName.hidden = true;
    entryLink.hidden = true;
    placeholder.textContent = "This card’s details are currently unavailable.";
    showUnavailableImage();
    return fragment;
  }

  name.textContent = beetle.commonName;
  scientificName.textContent = beetle.scientificName;
  entryLink.href = `entry.html?id=${encodeURIComponent(beetle.id)}`;
  let usingPhoto = !card.artwork;

  function showPhoto() {
    usingPhoto = true;

    if (!beetle.image) {
      showUnavailableImage();
      return;
    }

    image.classList.add("is-photo");
    image.alt = beetle.imageAlt || `${beetle.commonName} specimen`;
    image.src = beetle.image;

    if (beetle.imageCredit) {
      photoSource.textContent = beetle.imageCredit.author;
      photoSource.href = beetle.imageCredit.source;
      photoLicense.textContent = beetle.imageCredit.license;
      photoLicense.href = beetle.imageCredit.licenseUrl;
      credit.hidden = false;
    }
  }

  image.addEventListener("error", () => {
    if (!usingPhoto) {
      showPhoto();
    } else {
      showUnavailableImage();
    }
  });

  if (card.artwork) {
    image.alt = `Watercolor illustration of ${beetle.commonName}`;
    image.src = card.artwork;
  } else {
    showPhoto();
  }

  return fragment;
}
