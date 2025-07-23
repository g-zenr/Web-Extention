// Function to find the button element (handles clicks on child elements)
export function findButtonElement(element: Element | null): Element | null {
  if (!element) return null;

  // If it's already a button, return it
  if (element.tagName === "BUTTON") {
    return element;
  }

  // Walk up the DOM tree to find the button
  let current = element.parentElement;
  while (current && current !== document.body) {
    if (current.tagName === "BUTTON") {
      return current;
    }
    current = current.parentElement;
  }

  return null;
}

// Function to detect Encode Key button
export function isEncodeKeyButton(element: Element): boolean {
  const button = findButtonElement(element);
  if (!button) return false;

  console.log("🔍 Checking button:", button.textContent?.trim());

  // Check if button contains "Encode Key" or "Add IC Card" text
  const buttonText = button.textContent?.trim().toLowerCase() || "";
  if (buttonText.includes("encode key") || buttonText.includes("add ic card")) {
    console.log("✅ Found Encode Key or Add IC Card button by text!");
    return true;
  }

  // Check for the lucide-key-round SVG icon
  const svg = button.querySelector("svg.lucide-key-round");
  if (svg) {
    console.log("✅ Found Encode Key button by SVG icon!");
    return true;
  }

  // Check for the specific SVG path for key-round icon
  const svgPaths = button.querySelectorAll("svg path");
  if (svgPaths.length >= 1) {
    const pathData = [];
    for (let i = 0; i < svgPaths.length; i++) {
      pathData.push(svgPaths[i].getAttribute("d"));
    }
    if (
      pathData.includes(
        "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
      )
    ) {
      console.log("✅ Found Encode Key button by SVG path data!");
      return true;
    }
  }

  return false;
}
