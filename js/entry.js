import { getBeetles } from "./beetles.js";

const params = new URLSearchParams(window.location.search);
const beetleId = params.get("id") || "stag-beetle";

const entryContent = document.getElementById("entry-content");
const entryName = document.getElementById("entry-name");
const entryScientificName = document.getElementById("entry-scientific-name");
const entryImage = document.getElementById("entry-image");
const entryMessage = document.getElementById("entry-message");
const entryPhotoSource = document.getElementById("entry-photo-source");
const entryPhotoLicense = document.getElementById("entry-photo-license");
const entryOverview = document.getElementById("entry-overview");
const entryOverviewSource = document.getElementById("entry-overview-source");
const entryLength = document.getElementById("entry-length");
const entryHabitat = document.getElementById("entry-habitat");
const entryDistribution = document.getElementById("entry-distribution");
const entryDistributionSource = document.getElementById(
  "entry-distribution-source",
);

async function loadEntry() {
  try {
    const beetles = await getBeetles();
    const beetle = beetles.find((beetle) => beetle.id === beetleId);

    if (!beetle) {
      entryMessage.textContent =
        "Beetle not found. Return to the encyclopedia to choose a species.";

      document.title = "Beetle not found | Coleopterium";
      return;
    }

    entryName.textContent = beetle.commonName;
    entryScientificName.textContent = beetle.scientificName;
    entryLength.textContent = beetle.facts.adultLength;
    entryHabitat.textContent = beetle.facts.habitat;
    entryImage.src = beetle.image;
    entryImage.alt = beetle.imageAlt;

    entryPhotoSource.textContent = beetle.imageCredit.author;
    entryPhotoSource.href = beetle.imageCredit.source;
    entryPhotoLicense.textContent = beetle.imageCredit.license;
    entryPhotoLicense.href = beetle.imageCredit.licenseUrl;

    document.title = `${beetle.commonName} | Coleopterium`;

    entryOverview.textContent = beetle.overview.text;
    entryOverviewSource.textContent = beetle.overview.sourceName;
    entryOverviewSource.href = beetle.overview.sourceUrl;
    entryDistribution.textContent = beetle.distribution.text;
    entryDistributionSource.textContent = beetle.distribution.sourceName;
    entryDistributionSource.href = beetle.distribution.sourceUrl;

    const map = beetle.distribution.map;

    if (map) {
      const mapImage = document.getElementById("entry-map-image");
      mapImage.src = map.image;
      mapImage.alt = map.imageAlt;

      document.getElementById("entry-map-caption").textContent = map.caption;

      const mapSource = document.getElementById("entry-map-source");
      mapSource.textContent = map.author;
      mapSource.href = map.sourceUrl;

      const mapLicense = document.getElementById("entry-map-license");
      mapLicense.textContent = map.license;
      mapLicense.href = map.licenseUrl;

      document.getElementById("entry-map").hidden = false;
    }

    entryContent.hidden = false;
    entryMessage.textContent = "";
    
  } catch (error) {
    entryMessage.textContent =
      "The species information could not be loaded. Please reload the page.";

    console.error("Could not load the species entry:", error);
  }
}

loadEntry();
