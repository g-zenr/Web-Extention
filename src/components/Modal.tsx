import React, { useState, useEffect } from "react";
import {
  ModalProps,
  OfflineData,
  GatewayData,
  TTLockData,
} from "../types/ttlock";
import { ttlockApiService } from "../services/ttlockApi";

const tabClasses = (active: boolean) =>
  `flex-1 py-2 px-4 text-center cursor-pointer rounded-t-lg font-medium transition-colors duration-150 ${
    active ? "bg-white text-black shadow" : "bg-gray-100 text-gray-500"
  }`;

const inputClasses =
  "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200";

const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

const sectionTitle = "font-semibold text-lg mb-2 mt-4 flex items-center gap-2";

const Modal: React.FC<ModalProps> = ({
  guestName,
  roomNumber,
  onClose,
  onEncode,
}) => {
  const [selectedType, setSelectedType] = useState<"offline" | "gateway">(
    "offline"
  );
  const [offlineData, setOfflineData] = useState<Omit<OfflineData, "type">>({
    buildingNumber: "1",
    floorNumber: "1",
    lockMac: "4B:C1:BD:4C:0C:45",
    cardNumber: "",
    cardName: "",
    cardType: "",
    addType: "",
    startDate: "",
    expireDate: "365",
  });
  const [reverseLock, setReverseLock] = useState(true);
  const [gatewayCardNumber, setGatewayCardNumber] = useState("");
  const [gatewayCardName, setGatewayCardName] = useState("");
  const [gatewayCardType, setGatewayCardType] = useState("Normal Card");
  const [gatewayAccessType, setGatewayAccessType] =
    useState("Permanent Access");

  useEffect(() => {
    const defaultValues = ttlockApiService.getDefaultValues();
    setOfflineData((prev) => ({
      ...prev,
      cardType: "keycard",
      addType: "temporary",
    }));
  }, []);

  const handleOfflineInputChange = (
    field: keyof Omit<OfflineData, "type">,
    value: string
  ) => {
    setOfflineData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Placeholder handlers for buttons
  const handleClearCard = () => alert("Clear Card clicked");
  const handleReadCard = () => alert("Read Card clicked");
  const handleWriteCard = () => alert("Write Card clicked");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
      style={{ pointerEvents: "auto" }}
    >
      <div
        className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-lg w-full mx-auto relative z-50 overflow-y-auto max-h-screen p-6"
        onClick={(e) => e.stopPropagation()}
        style={{ pointerEvents: "auto" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-2 pt-2 pb-2">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <rect width="24" height="24" rx="6" fill="#2563EB" />
                <rect x="6" y="7" width="12" height="10" rx="2" fill="#fff" />
                <rect x="9" y="10" width="6" height="2" rx="1" fill="#2563EB" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-xl">Card Encoder</div>
              <div className="text-gray-500 text-sm">
                Configure access card settings
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded flex items-center">
              <svg
                className="w-2 h-2 mr-1"
                fill="currentColor"
                viewBox="0 0 8 8"
              >
                <circle cx="4" cy="4" r="4" />
              </svg>
              Offline
            </span>
            <button
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4 px-2 pt-2">
          <div
            className={tabClasses(selectedType === "offline")}
            onClick={() => setSelectedType("offline")}
          >
            Encoder
          </div>
          <div
            className={tabClasses(selectedType === "gateway")}
            onClick={() => setSelectedType("gateway")}
          >
            Gateway
          </div>
        </div>
        {/* Tab Content */}
        {selectedType === "offline" && (
          <div className="pb-6">
            {/* Building & Floor */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="flex items-center gap-1 font-semibold text-gray-800 mb-1 text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="3"
                      y="7"
                      width="18"
                      height="10"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <rect
                      x="7"
                      y="10"
                      width="2"
                      height="2"
                      rx="1"
                      fill="currentColor"
                    />
                    <rect
                      x="15"
                      y="10"
                      width="2"
                      height="2"
                      rx="1"
                      fill="currentColor"
                    />
                  </svg>
                  Building
                </label>
                <input
                  className={inputClasses}
                  value={offlineData.buildingNumber}
                  onChange={(e) =>
                    handleOfflineInputChange("buildingNumber", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="flex items-center gap-1 font-semibold text-gray-800 mb-1 text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 2v20M2 12h20"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Floor
                </label>
                <input
                  className={inputClasses}
                  value={offlineData.floorNumber}
                  onChange={(e) =>
                    handleOfflineInputChange("floorNumber", e.target.value)
                  }
                />
              </div>
            </div>
            {/* Device MAC Address */}
            <div className="mb-4">
              <label className="flex items-center gap-1 font-semibold text-gray-800 mb-1 text-sm">
                <span className="text-lg font-bold">+</span> Device MAC Address
              </label>
              <input
                className={inputClasses}
                value={offlineData.lockMac}
                onChange={(e) =>
                  handleOfflineInputChange("lockMac", e.target.value)
                }
                placeholder="Enter the MAC address of the target device"
              />
              <div className="text-xs text-gray-400 mt-1">
                Enter the MAC address of the target device
              </div>
            </div>
            {/* Expiration */}
            <div className="mb-4">
              <label className="flex items-center gap-1 font-semibold text-gray-800 mb-1 text-sm">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" />
                </svg>
                Expiration (days)
              </label>
              <input
                className={inputClasses}
                value={offlineData.expireDate}
                onChange={(e) =>
                  handleOfflineInputChange("expireDate", e.target.value)
                }
              />
              <div className="text-xs text-gray-400 mt-1">
                Number of days until card expires
              </div>
            </div>
            {/* Divider */}
            <hr className="my-6" />
            {/* Security Options */}
            <div className="mb-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
              <label className="flex items-center gap-1 font-semibold text-gray-800 mb-2 text-base">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path d="M12 16v-4" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="8" r="1" fill="currentColor" />
                </svg>
                Security Options
              </label>
              <label className="flex items-center space-x-2 font-medium">
                <input
                  type="checkbox"
                  checked={reverseLock}
                  onChange={(e) => setReverseLock(e.target.checked)}
                  className="form-checkbox"
                />
                <span>Allow Reverse Lock</span>
              </label>
              <div className="text-xs text-gray-400 mt-1">
                Enable reverse lock functionality for enhanced security
              </div>
            </div>
            {/* Buttons */}
            <div className="flex justify-center space-x-4 mt-6">
              <button className="py-3 px-4 text-base border border-gray-300 rounded bg-white hover:bg-gray-50 flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="3"
                    y="6"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M8 6V4a4 4 0 1 1 8 0v2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                Clear Card
              </button>
              <button className="py-3 px-4 text-base border border-gray-300 rounded bg-white hover:bg-gray-50 flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
                Read Card
              </button>
              <button className="py-3 px-4 text-base border border-gray-300 rounded bg-white hover:bg-gray-50 flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path d="M8 12h8" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 8v8" stroke="currentColor" strokeWidth="2" />
                </svg>
                Write Card
              </button>
            </div>
          </div>
        )}
        {selectedType === "gateway" && (
          <div className="pb-6">
            <div className="p-0">
              <label className="flex items-center gap-1 font-semibold text-gray-800 mb-4 text-lg">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="3"
                    y="7"
                    width="18"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <rect
                    x="7"
                    y="10"
                    width="2"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  />
                  <rect
                    x="15"
                    y="10"
                    width="2"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  />
                </svg>
                Create New Card
              </label>
              <div className="mb-4">
                <label className="flex items-center gap-1 font-semibold text-gray-800 mb-1 text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="3"
                      y="7"
                      width="18"
                      height="10"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <rect
                      x="7"
                      y="10"
                      width="2"
                      height="2"
                      rx="1"
                      fill="currentColor"
                    />
                    <rect
                      x="15"
                      y="10"
                      width="2"
                      height="2"
                      rx="1"
                      fill="currentColor"
                    />
                  </svg>
                  Card Number <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputClasses}
                  placeholder="Enter card number"
                  value={gatewayCardNumber}
                  onChange={(e) => setGatewayCardNumber(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center gap-1 font-semibold text-gray-800 mb-1 text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 2v20M2 12h20"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Card Name (Optional)
                </label>
                <input
                  className={inputClasses}
                  placeholder="Enter a name for this card"
                  value={gatewayCardName}
                  onChange={(e) => setGatewayCardName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center gap-1 font-semibold text-gray-800 mb-1 text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="4"
                      y="4"
                      width="16"
                      height="16"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path d="M8 12h8" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Card Type
                </label>
                <select
                  className={inputClasses}
                  value={gatewayCardType}
                  onChange={(e) => setGatewayCardType(e.target.value)}
                >
                  <option>Normal Card</option>
                  <option>VIP Card</option>
                  <option>Guest Card</option>
                </select>
              </div>
              <div className="mb-8">
                <label className="flex items-center gap-1 font-semibold text-gray-800 mb-1 text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                  </svg>
                  Access Type
                </label>
                <select
                  className={inputClasses}
                  value={gatewayAccessType}
                  onChange={(e) => setGatewayAccessType(e.target.value)}
                >
                  <option>Permanent Access</option>
                  <option>Temporary Access</option>
                </select>
              </div>
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  className="py-3 px-4 text-base border border-gray-300 rounded bg-white hover:bg-gray-50 flex items-center justify-center gap-2"
                  onClick={onClose}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="3"
                      y="6"
                      width="18"
                      height="14"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M8 6V4a4 4 0 1 1 8 0v2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Cancel
                </button>
                <button className="py-3 px-4 text-base border border-gray-300 rounded bg-white hover:bg-gray-50 flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="4"
                      y="4"
                      width="16"
                      height="16"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path d="M8 12h8" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 8v8" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  + Create IC Card
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
