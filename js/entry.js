import { getBeetles } from "./beetles.js";

const entryName = document.getElementById("entry-name");
const entryScientificName = document.getElementById("entry-scientific-name");
const entryImage = document.getElementById("entry-image");
const entryMessage = document.getElementById("entry-message");
const entryPhotoSource = document.getElementById("entry-photo-source");
const entryPhotoLicense = document.getElementById("entry-photo-license");

async function loadEntry() {
  try {
    const beetles = await getBeetles();
    const beetle = beetles.find((beetle) => beetle.id === "stag-beetle");

    if (!beetle) {
      throw new Error("Stag beetle entry was not found.");
    }

    entryName.textContent = beetle.commonName;
    entryScientificName.textContent = beetle.scientificName;
    entryImage.src = beetle.image;
    entryImage.alt = beetle.imageAlt;
    entryPhotoSource.textContent = beetle.imageCredit.author;
    entryPhotoSource.href = beetle.imageCredit.source;

    entryPhotoLicense.textContent = beetle.imageCredit.license;
    entryPhotoLicense.href = beetle.imageCredit.licenseUrl;

    document.title = `${beetle.commonName} | Coleopterium`;
  } catch (error) {
    entryMessage.textContent =
      "The species information could not be loaded. Please reload the page.";

    console.error("Could not load the species entry:", error);
  }
}

loadEntry();
