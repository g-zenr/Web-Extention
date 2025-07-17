import React from "react";
import { createRoot } from "react-dom/client";
import Modal from "./Modal";
import "./styles.css";

interface OfflineData {
  type: "offline";
  buildingNumber: string;
  floorNumber: string;
  lockMac: string;
  cardNumber: string;
  cardName: string;
  cardType: string;
  addType: string;
  startDate: string;
  expireDate: string;
}

interface GatewayData {
  type: "gateway";
  guestName: string;
  roomNumber: string;
  buildingNumber: string;
  floorNumber: string;
  clientId: string;
  accessToken: string;
  lockId: string;
  cardNumber: string;
  cardName: string;
  cardType: string;
  addType: string;
  startDate: string;
  expireDate: string;
}

type TTLockData = OfflineData | GatewayData;

// Function to find the button element (handles clicks on child elements)
function findButtonElement(element: Element | null): Element | null {
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
function isEncodeKeyButton(element: Element): boolean {
  const button = findButtonElement(element);
  if (!button) return false;

  console.log("🔍 Checking button:", button.textContent?.trim());

  // Check if button contains "Encode Key" text
  const buttonText = button.textContent?.trim().toLowerCase() || "";
  if (buttonText.includes("encode key")) {
    console.log("✅ Found Encode Key button by text!");
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

// Function to scrape guest name and room number from the page
function scrapeGuestInfo(): { guestName: string; roomNumber: string } {
  console.log("🔍 Scraping guest information from page...");

  let guestName = "";
  let roomNumber = "";

  try {
    // Strategy 1: Look for specific input fields or form elements
    const inputs = document.querySelectorAll(
      'input[type="text"], input[type="email"], input'
    );
    for (const input of Array.from(inputs)) {
      const inputElement = input as HTMLInputElement;
      const placeholder = inputElement.placeholder?.toLowerCase() || "";
      const name = inputElement.name?.toLowerCase() || "";
      const value = inputElement.value?.trim() || "";

      if (
        value &&
        (placeholder.includes("guest") ||
          placeholder.includes("name") ||
          name.includes("guest") ||
          name.includes("name")) &&
        !placeholder.includes("room") &&
        !name.includes("room")
      ) {
        if (
          !guestName &&
          value.length > 2 &&
          value.length < 100 &&
          !value.toLowerCase().includes("reservation") &&
          !value.toLowerCase().includes("guest") &&
          value.match(/^[A-Za-z\s\-\.]+$/)
        ) {
          guestName = value;
          console.log("✅ Found Guest Name from input:", guestName);
        }
      }

      if (value && (placeholder.includes("room") || name.includes("room"))) {
        if (!roomNumber && value.length > 0 && value.length < 50) {
          // Extract just the number part
          const roomMatch = value.match(/(\d+)/);
          roomNumber = roomMatch ? roomMatch[1] : value;
          console.log("✅ Found Room Number from input:", roomNumber);
        }
      }
    }

    // Strategy 2: Look for labeled values in spans, divs, or other elements
    const allElements = document.querySelectorAll("*");
    for (const element of Array.from(allElements)) {
      const textContent = element.textContent?.trim() || "";

      // Skip if element contains too much text (likely a container)
      if (textContent.length > 200) continue;

      // Look for Guest Name labels and try to find the actual value
      if (textContent.includes("Guest Name") && !guestName) {
        // Look for the value in nearby elements
        const parent = element.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children);
          const currentIndex = siblings.indexOf(element);

          // Check next sibling
          if (currentIndex < siblings.length - 1) {
            const nextSibling = siblings[currentIndex + 1] as Element;
            const nextText = nextSibling.textContent?.trim() || "";
            if (
              nextText &&
              nextText !== "Guest Name" &&
              nextText.length > 2 &&
              nextText.length < 100
            ) {
              // Extract just the name part using regex - avoid labels
              const nameMatch = nextText.match(/^([A-Za-z\s\-\.]+)$/);
              if (
                nameMatch &&
                !nameMatch[1].toLowerCase().includes("reservation") &&
                !nameMatch[1].toLowerCase().includes("guest") &&
                !nameMatch[1].toLowerCase().includes("name") &&
                !nameMatch[1].toLowerCase().includes("room") &&
                nameMatch[1].split(" ").length >= 2
              ) {
                guestName = nameMatch[1].trim();
                console.log("✅ Found Guest Name from sibling:", guestName);
              }
            }
          }
        }
      }

      // Look for Room Number labels and try to find the actual value
      if (textContent.includes("Room Number") && !roomNumber) {
        const parent = element.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children);
          const currentIndex = siblings.indexOf(element);

          // Check next sibling
          if (currentIndex < siblings.length - 1) {
            const nextSibling = siblings[currentIndex + 1] as Element;
            const nextText = nextSibling.textContent?.trim() || "";
            if (
              nextText &&
              nextText !== "Room Number" &&
              nextText.length > 0 &&
              nextText.length < 50
            ) {
              // Extract just the room number part using regex
              const roomMatch = nextText.match(/(\d+)/);
              if (roomMatch) {
                roomNumber = roomMatch[1];
                console.log("✅ Found Room Number from sibling:", roomNumber);
              }
            }
          }
        }
      }
    }

    // Strategy 3: Pattern matching as fallback
    if (!guestName) {
      // Look for name patterns in smaller text chunks
      const smallTextElements = Array.from(
        document.querySelectorAll("span, div, p, td, th")
      )
        .filter(
          (el) =>
            el.textContent &&
            el.textContent.trim().length > 2 &&
            el.textContent.trim().length < 50
        )
        .map((el) => el.textContent!.trim());

      for (const text of smallTextElements) {
        const nameMatch = text.match(/^([A-Z][a-z]+ [A-Z][a-z]+)$/);
        if (
          nameMatch &&
          !nameMatch[1].includes("Guest") &&
          !nameMatch[1].includes("Room") &&
          !nameMatch[1].includes("Reservation") &&
          !nameMatch[1].includes("Number") &&
          !nameMatch[1].includes("Information")
        ) {
          guestName = nameMatch[1];
          console.log("✅ Found Guest Name (pattern):", guestName);
          break;
        }
      }
    }

    if (!roomNumber) {
      // Look for room number patterns
      const bodyText = document.body.textContent || "";
      const roomMatch = bodyText.match(/\b(?:Room\s+)?(\d{3,4})\b/i);
      if (roomMatch) {
        roomNumber = roomMatch[1];
        console.log("✅ Found Room Number (pattern):", roomNumber);
      }
    }

    console.log("📋 Scraped guest info:", { guestName, roomNumber });
  } catch (error) {
    console.error("❌ Error scraping guest info:", error);
  }

  return { guestName, roomNumber };
}

// Function to handle the encode action
function handleEncode(data: TTLockData) {
  console.log("🔑 Encoding TTLock data:", data);

  // Here you can add the actual encoding logic
  // For now, we'll just log the data and show a success message
  if (data.type === "offline") {
    alert(`Encoding TTLock (Offline) with data:
Building: ${data.buildingNumber}
Floor: ${data.floorNumber}
Lock MAC: ${data.lockMac}
Card Number: ${data.cardNumber}
Card Name: ${data.cardName}
Card Type: ${data.cardType}
Add Type: ${data.addType}
Start Date: ${data.startDate}
Expire Date: ${data.expireDate}`);
  } else {
    alert(`Encoding TTLock (Gateway) with data:
Guest: ${data.guestName}
Room: ${data.roomNumber}
Building: ${data.buildingNumber}
Floor: ${data.floorNumber}
Client ID: ${data.clientId}
Access Token: ${data.accessToken}
Lock ID: ${data.lockId}
Card Number: ${data.cardNumber}
Card Name: ${data.cardName}
Card Type: ${data.cardType}
Add Type: ${data.addType}
Start Date: ${data.startDate}
Expire Date: ${data.expireDate}`);
  }

  // Close the modal after successful encoding
  const modalContainer = document.getElementById("encode-key-monitor-modal");
  if (modalContainer) {
    modalContainer.remove();
  }
}

// Function to show modal
function showModal() {
  console.log("🎉 Opening TTLock encode modal");

  // Scrape guest information from the page
  const { guestName, roomNumber } = scrapeGuestInfo();

  // Remove existing modal if present
  const existingModal = document.getElementById("encode-key-monitor-modal");
  if (existingModal) {
    existingModal.remove();
  }

  // Create modal container
  const modalContainer = document.createElement("div");
  modalContainer.id = "encode-key-monitor-modal";
  modalContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999999;
    pointer-events: auto;
    transform: translateZ(0);
    will-change: transform;
    isolation: isolate;
  `;

  // Prevent the modal from interfering with browser zoom
  modalContainer.addEventListener(
    "wheel",
    (e) => {
      // Only prevent default if the event is not a zoom gesture
      if (!e.ctrlKey && !e.metaKey) {
        e.stopPropagation();
      }
    },
    { passive: true }
  );

  document.body.appendChild(modalContainer);

  // Create React root and render modal
  const root = createRoot(modalContainer);
  root.render(
    <Modal
      guestName={guestName}
      roomNumber={roomNumber}
      onClose={() => {
        console.log("🔄 Closing TTLock encode modal");
        modalContainer.remove();
      }}
      onEncode={handleEncode}
    />
  );
}

// Main click handler
function handleClick(event: Event) {
  const target = event.target as Element;

  // Don't interfere with input interactions
  if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
    return;
  }

  // Don't interfere with modal interactions
  if (target.closest("#encode-key-monitor-modal")) {
    return;
  }

  // Don't interfere with browser UI elements
  if (
    target.closest('chrome-extension-ui, [role="toolbar"], [role="menubar"]')
  ) {
    return;
  }

  // Don't interfere with system dialogs or zoom controls
  if (target.closest('[aria-label*="zoom"], [aria-label*="Zoom"]')) {
    return;
  }

  console.log(
    "🖱️ Click detected on:",
    target.tagName,
    target.textContent?.trim()
  );

  if (isEncodeKeyButton(target)) {
    console.log("🎯 Encode Key button clicked!");
    event.stopPropagation(); // Only stop propagation for our target button
    showModal();
  }
}

// Initialize the extension
function initializeExtension() {
  console.log("🚀 TTLock Extension initializing...");

  // Check if we're on the right page
  if (!window.location.href.includes("localhost:5173")) {
    console.log("❌ Not on target page, skipping initialization");
    return;
  }

  console.log("✅ On target page, setting up click monitoring");

  // Add click listener to document
  document.addEventListener("click", handleClick, true);

  // Custom event listener for programmatic triggers
  document.addEventListener("openEncodeKeyModal", () => {
    console.log("📢 Custom event triggered");
    showModal();
  });

  console.log("🎉 TTLock Extension initialized successfully!");
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeExtension);
} else {
  initializeExtension();
}

// Also try to initialize after a short delay for dynamic content
setTimeout(initializeExtension, 1000);
setTimeout(initializeExtension, 3000);
