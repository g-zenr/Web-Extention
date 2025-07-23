import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Modal from "./components/Modal";
import { useTTLockEncode, useTTLockOfflineEncode } from "./hooks/useTTLockApi";
import { TTLockData, GuestInfo } from "./types/ttlock";
import { isEncodeKeyButton } from "./utils/buttonUtils";
import "./styles.css";

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Function to scrape guest name and room number from the page
function scrapeGuestInfo(): GuestInfo {
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

// React component that uses hooks
const ModalWithHooks: React.FC<{
  guestName: string;
  roomNumber: string;
  onClose: () => void;
}> = ({ guestName, roomNumber, onClose }) => {
  const gatewayEncode = useTTLockEncode();
  const offlineEncode = useTTLockOfflineEncode();

  const handleEncode = async (data: TTLockData) => {
    console.log("🔑 Encoding TTLock data:", data);

    if (data.type === "offline") {
      try {
        await offlineEncode.mutateAsync(data);

        alert(`✅ Initialization request sent successfully to localhost:8080/initialize!

The following parameters were sent:
- Client ID: 4b8bc0348ff54d3186a1fd2128ed7274
- Client Secret: 28f2d59934a748da1d518eb76833440d
- Serial Port: COM5
- Sectors: 0000000000011111

Offline encoding data:
Building: ${data.buildingNumber}
Floor: ${data.floorNumber}
Lock MAC: ${data.lockMac}
Card Number: ${data.cardNumber}
Card Name: ${data.cardName}
Card Type: ${data.cardType}
Add Type: ${data.addType}
Start Date: ${data.startDate}
Expire Date: ${data.expireDate}`);
      } catch (error) {
        console.error("❌ Offline encoding error:", error);
        alert(
          `❌ Offline encoding failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    } else {
      try {
        const response = await gatewayEncode.mutateAsync(data);

        if (response.success) {
          alert(`✅ Key encoded successfully via TTLock API!

Guest: ${data.guestName}
Room: ${data.roomNumber}
Building: ${data.buildingNumber}
Floor: ${data.floorNumber}
Lock ID: ${data.lockId}
Card Number: ${data.cardNumber}
Card Name: ${data.cardName}

API Response: ${JSON.stringify(response.data, null, 2)}`);
        } else {
          alert(
            `❌ Key encoding failed: ${response.message || "Unknown error"}`
          );
        }
      } catch (error) {
        console.error("❌ Gateway encoding error:", error);
        alert(
          `❌ Key encoding failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    // Close the modal after processing
    onClose();
  };

  return (
    <Modal
      guestName={guestName}
      roomNumber={roomNumber}
      onClose={onClose}
      onEncode={handleEncode}
    />
  );
};

// Function to show modal with React Query provider
function showModal() {
  console.log("🎉 Opening TTLock encode modal");

  // Scrape guest information from the page BEFORE creating the modal
  const { guestName, roomNumber } = scrapeGuestInfo();

  // Remove existing modal if present
  const existingModal = document.getElementById("encode-key-monitor-modal");
  if (existingModal) {
    existingModal.remove();
  }

  // Create modal container with minimal interference
  const modalContainer = document.createElement("div");
  modalContainer.id = "encode-key-monitor-modal";
  modalContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    pointer-events: none;
  `;

  // Append to body without affecting layout
  document.body.appendChild(modalContainer);

  // Create React root and render modal with QueryClient provider
  const root = createRoot(modalContainer);

  root.render(
    <QueryClientProvider client={queryClient}>
      <ModalWithHooks
        guestName={guestName}
        roomNumber={roomNumber}
        onClose={() => {
          console.log("🔄 Closing TTLock encode modal");
          modalContainer.remove();
        }}
      />
    </QueryClientProvider>
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

  console.log(
    "🖱️ Click detected on:",
    target.tagName,
    target.textContent?.trim()
  );

  if (isEncodeKeyButton(target)) {
    console.log("🎯 Encode Key button clicked!");
    showModal();
  }
}

// Initialize the extension
function initializeExtension() {
  console.log("🚀 TTLock Extension initializing...");

  // Check if we're on the right page
  if (!window.location.href.includes("https://onebis-app-pro-max.web.app/")) {
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
