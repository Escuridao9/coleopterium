const sources = {
  museum: {
    name: "Australian Museum",
    url: "https://australian.museum/learn/animals/insects/christmas-beetles/christmas-beetles-glossary/"
  },
  nhm: {
    name: "Natural History Museum",
    url: "https://www.nhm.ac.uk/schools/teaching-resources/key-stage-1/animal-and-human-bodies/parts-of-an-insect.html"
  },
  ptes: {
    name: "People's Trust for Endangered Species",
    url: "https://ptes.org/campaigns/stag-beetles-2/stag-beetle-facts/"
  }
};

const parts = {
  antennae: {
    name: "Antennae",
    description: "A pair of segmented sensory appendages. They help the beetle gather information about its surroundings.",
    source: "museum"
  },
  head: {
    name: "Head",
    description: "The forward body region, where many sensory structures are concentrated.",
    source: "museum"
  },
  pronotum: {
    name: "Pronotum",
    description: "The protective upper plate of the first thoracic segment. It sits just behind the head.",
    source: "museum"
  },
  elytra: {
    name: "Elytra",
    description: "Two hardened front wings that shield the folded hind wings and much of the abdomen.",
    source: "museum"
  },
  legs: {
    name: "Legs",
    description: "Six jointed legs, arranged in three pairs and attached to the thorax.",
    source: "nhm"
  },
  mandibles: {
    name: "Mandibles",
    description: "The jaws. Male stag beetles have an enlarged pair used to wrestle with other males during courtship.",
    source: "ptes"
  }
};

export function renderAnatomy(beetle) {
  const image = document.getElementById("anatomy-image");
  const labels = document.getElementById("anatomy-labels");
  const lines = document.getElementById("anatomy-lines");
  const template = document.getElementById("anatomy-label-template");
  const partName = document.getElementById("anatomy-part-name");
  const partText = document.getElementById("anatomy-part-text");
  const partSource = document.getElementById("anatomy-part-source");

  image.src = beetle.sizeComparison.image;
  image.alt = `Simplified top view of the ${beetle.commonName.toLowerCase()}`;
  labels.replaceChildren();
  lines.replaceChildren();

  const controls = beetle.anatomy.map(point => {
    const clone = template.content.cloneNode(true);
    const button = clone.querySelector("button");
    const pointer = clone.querySelector("g");
    const startX = point.side === "left" ? 26 : 74;
    const bendX = point.side === "left" ? 33 : 67;

    button.textContent = parts[point.part].name;
    button.dataset.side = point.side;
    button.style.top = `${point.labelY}%`;

    pointer.querySelector("polyline").setAttribute(
      "points",
      `${startX},${point.labelY} ${bendX},${point.labelY} ${point.x},${point.y}`
    );

    const dot = pointer.querySelector("circle");
    dot.setAttribute("cx", point.x);
    dot.setAttribute("cy", point.y);

    ["mouseenter", "focus", "click"].forEach(eventName => {
      button.addEventListener(eventName, () => showPart(point.part));
    });

    labels.append(button);
    lines.append(pointer);

    return { part: point.part, button, pointer };
  });

  function showPart(selectedPart) {
    const part = parts[selectedPart];
    const source = sources[part.source];

    partName.textContent = part.name;
    partText.textContent = part.description;
    partSource.textContent = source.name;
    partSource.href = source.url;

    controls.forEach(control => {
      const active = control.part === selectedPart;
      control.button.classList.toggle("is-active", active);
      control.button.setAttribute("aria-pressed", String(active));
      control.pointer.classList.toggle("is-active", active);
    });
  }

  showPart(beetle.anatomy[0].part);
}
