import React, { useState } from "react";
import { toast } from "sonner";

const tabClasses = (active: boolean) =>
  `flex-1 py-2 px-4 text-center cursor-pointer rounded-t-lg font-medium transition-colors duration-150 ${
    active ? "bg-white text-black shadow" : "bg-gray-100 text-gray-500"
  }`;

const inputClasses =
  "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200";

const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

const sectionTitle = "font-semibold text-lg mb-2 mt-4";

const CardEncoder: React.FC = () => {
  const [tab, setTab] = useState<"encoder" | "gateway">("encoder");
  // Encoder state
  const [building, setBuilding] = useState("1");
  const [floor, setFloor] = useState("1");
  const [mac, setMac] = useState("");
  const [expiration, setExpiration] = useState("365");
  const [reverseLock, setReverseLock] = useState(true);
  // Gateway state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardType, setCardType] = useState("Normal Card");
  const [accessType, setAccessType] = useState("Permanent Access");

  // Handlers (placeholders)
  const handleClearCard = () => toast("Clear Card clicked");
  const handleReadCard = () => toast("Read Card clicked");
  const handleWriteCard = () => toast("Write Card clicked");
  const handleCreateICCard = () => toast("Create IC Card clicked");
  const handleCancel = () => toast("Cancel clicked");

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6 relative">
      {/* Header */}
      <div className="flex items-center mb-4">
        <div className="bg-blue-100 p-2 rounded mr-3">
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
        <div className="ml-auto flex items-center space-x-2">
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded flex items-center">
            <svg className="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="4" />
            </svg>
            Offline
          </span>
          <button className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            ×
          </button>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <div
          className={tabClasses(tab === "encoder")}
          onClick={() => setTab("encoder")}
        >
          Encoder
        </div>
        <div
          className={tabClasses(tab === "gateway")}
          onClick={() => setTab("gateway")}
        >
          Gateway
        </div>
      </div>
      {/* Tab Content */}
      {tab === "encoder" ? (
        <div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClasses}>Building</label>
              <input
                className={inputClasses}
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClasses}>Floor</label>
              <input
                className={inputClasses}
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className={labelClasses}>Device MAC Address</label>
            <input
              className={inputClasses}
              value={mac}
              onChange={(e) => setMac(e.target.value)}
              placeholder="Enter the MAC address of the target device"
            />
          </div>
          <div className="mb-4">
            <label className={labelClasses}>Expiration (days)</label>
            <input
              className={inputClasses}
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
            />
            <div className="text-xs text-gray-400 mt-1">
              Number of days until card expires
            </div>
          </div>
          <div className="border-t border-gray-200 my-4"></div>
          <div className="mb-4">
            <div className={sectionTitle}>Security Options</div>
            <label className="flex items-center space-x-2">
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
          <div className="flex space-x-2 mt-6">
            <button
              className="flex-1 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50"
              onClick={handleClearCard}
            >
              Clear Card
            </button>
            <button
              className="flex-1 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50"
              onClick={handleReadCard}
            >
              Read Card
            </button>
            <button
              className="flex-1 py-2 rounded bg-black text-white hover:bg-gray-800"
              onClick={handleWriteCard}
            >
              Write Card
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="font-bold text-lg mb-2">Create New Card</div>
          <div className="mb-4">
            <label className={labelClasses}>
              Card Number <span className="text-red-500">*</span>
            </label>
            <input
              className={inputClasses}
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="Enter card number"
            />
          </div>
          <div className="mb-4">
            <label className={labelClasses}>Card Name (Optional)</label>
            <input
              className={inputClasses}
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Enter a name for this card"
            />
          </div>
          <div className="mb-4">
            <label className={labelClasses}>Card Type</label>
            <select
              className={inputClasses}
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
            >
              <option>Normal Card</option>
              <option>VIP Card</option>
              <option>Guest Card</option>
            </select>
          </div>
          <div className="mb-4">
            <label className={labelClasses}>Access Type</label>
            <select
              className={inputClasses}
              value={accessType}
              onChange={(e) => setAccessType(e.target.value)}
            >
              <option>Permanent Access</option>
              <option>Temporary Access</option>
            </select>
          </div>
          <div className="flex space-x-2 mt-6">
            <button
              className="flex-1 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="flex-1 py-2 rounded bg-black text-white hover:bg-gray-800"
              onClick={handleCreateICCard}
            >
              + Create IC Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardEncoder;
