import React, { useState } from "react";

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

interface ModalProps {
  guestName: string;
  roomNumber: string;
  onClose: () => void;
  onEncode: (data: TTLockData) => void;
}

const Modal: React.FC<ModalProps> = ({
  guestName,
  roomNumber,
  onClose,
  onEncode,
}) => {
  const [selectedType, setSelectedType] = useState<
    "offline" | "gateway" | null
  >(null);
  const [offlineData, setOfflineData] = useState<Omit<OfflineData, "type">>({
    buildingNumber: "",
    floorNumber: "",
    lockMac: "",
    cardNumber: "",
    cardName: "",
    cardType: "",
    addType: "",
    startDate: "",
    expireDate: "",
  });
  const [gatewayData, setGatewayData] = useState<Omit<GatewayData, "type">>({
    guestName: guestName || "",
    roomNumber: roomNumber || "",
    buildingNumber: "",
    floorNumber: "",
    clientId: "",
    accessToken: "",
    lockId: "",
    cardNumber: "",
    cardName: "",
    cardType: "",
    addType: "",
    startDate: "",
    expireDate: "",
  });

  const handleOfflineInputChange = (
    field: keyof Omit<OfflineData, "type">,
    value: string
  ) => {
    setOfflineData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGatewayInputChange = (
    field: keyof Omit<GatewayData, "type">,
    value: string
  ) => {
    setGatewayData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEncode = () => {
    if (!selectedType) {
      alert("Please select a type (Offline or Gateway)");
      return;
    }

    if (selectedType === "offline") {
      // Validate offline fields
      if (
        !offlineData.buildingNumber ||
        !offlineData.floorNumber ||
        !offlineData.lockMac ||
        !offlineData.cardNumber ||
        !offlineData.cardName ||
        !offlineData.cardType ||
        !offlineData.addType ||
        !offlineData.startDate ||
        !offlineData.expireDate
      ) {
        alert("Please fill in all offline fields");
        return;
      }
      onEncode({ type: "offline", ...offlineData });
    } else {
      // Validate gateway fields
      if (
        !gatewayData.guestName ||
        !gatewayData.roomNumber ||
        !gatewayData.buildingNumber ||
        !gatewayData.floorNumber ||
        !gatewayData.clientId ||
        !gatewayData.accessToken ||
        !gatewayData.lockId ||
        !gatewayData.cardNumber ||
        !gatewayData.cardName ||
        !gatewayData.cardType ||
        !gatewayData.addType ||
        !gatewayData.startDate ||
        !gatewayData.expireDate
      ) {
        alert("Please fill in all gateway fields");
        return;
      }
      onEncode({ type: "gateway", ...gatewayData });
    }
  };

  const renderTypeSelection = () => (
    <div className="mb-8 p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-xl font-bold text-slate-800 text-center mb-6 flex items-center justify-center gap-2">
        <span className="text-2xl">🔧</span>
        Select Encoding Type
      </h3>
      <div className="flex gap-4 justify-center">
        <button
          className={`group relative px-8 py-4 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 min-w-[140px] flex items-center gap-3 justify-center shadow-lg ${
            selectedType === "offline"
              ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-violet-500/25 ring-4 ring-violet-200"
              : "bg-white text-slate-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:text-violet-700 border border-slate-200 hover:border-violet-300 hover:shadow-xl"
          }`}
          onClick={() => setSelectedType("offline")}
        >
          <span className="text-lg">📱</span>
          <span>Offline</span>
          {selectedType === "offline" && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              ✓
            </div>
          )}
        </button>
        <button
          className={`group relative px-8 py-4 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 min-w-[140px] flex items-center gap-3 justify-center shadow-lg ${
            selectedType === "gateway"
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-blue-500/25 ring-4 ring-blue-200"
              : "bg-white text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 border border-slate-200 hover:border-blue-300 hover:shadow-xl"
          }`}
          onClick={() => setSelectedType("gateway")}
        >
          <span className="text-lg">🌐</span>
          <span>Gateway</span>
          {selectedType === "gateway" && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              ✓
            </div>
          )}
        </button>
      </div>
    </div>
  );

  const renderGuestSection = () => (
    <div className="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
          👤
        </div>
        <h3 className="text-lg font-bold text-slate-800">Guest Information</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
            <span className="text-emerald-600">✨</span>
            Guest Name *
          </label>
          <input
            type="text"
            className="modal-input-emerald"
            value={gatewayData.guestName}
            onChange={(e) =>
              handleGatewayInputChange("guestName", e.target.value)
            }
            placeholder="Enter guest name"
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
            <span className="text-emerald-600">🏠</span>
            Room Number *
          </label>
          <input
            type="text"
            className="modal-input-emerald"
            value={gatewayData.roomNumber}
            onChange={(e) =>
              handleGatewayInputChange("roomNumber", e.target.value)
            }
            placeholder="Enter room number"
          />
        </div>
      </div>
    </div>
  );

  const renderLocationSection = () => (
    <div className="mb-8 p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
          🏢
        </div>
        <h3 className="text-lg font-bold text-slate-800">Location Details</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
            <span className="text-orange-600">🏗️</span>
            Building Number
          </label>
          <input
            type="text"
            className="modal-input-orange"
            value={
              selectedType === "offline"
                ? offlineData.buildingNumber
                : gatewayData.buildingNumber
            }
            onChange={(e) =>
              selectedType === "offline"
                ? handleOfflineInputChange("buildingNumber", e.target.value)
                : handleGatewayInputChange("buildingNumber", e.target.value)
            }
            placeholder="Enter building number"
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
            <span className="text-orange-600">🏬</span>
            Floor Number
          </label>
          <input
            type="text"
            className="modal-input-orange"
            value={
              selectedType === "offline"
                ? offlineData.floorNumber
                : gatewayData.floorNumber
            }
            onChange={(e) =>
              selectedType === "offline"
                ? handleOfflineInputChange("floorNumber", e.target.value)
                : handleGatewayInputChange("floorNumber", e.target.value)
            }
            placeholder="Enter floor number"
          />
        </div>
      </div>
    </div>
  );

  const renderSystemSection = () => (
    <div className="mb-8 p-6 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border border-red-200 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
          ⚙️
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          System Configuration
        </h3>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
          <span className="text-red-600">🔒</span>
          Lock MAC Address
        </label>
        <input
          type="text"
          className="modal-input-red"
          value={selectedType === "offline" ? offlineData.lockMac : ""}
          onChange={(e) => handleOfflineInputChange("lockMac", e.target.value)}
          placeholder="Enter lock MAC address"
        />
      </div>
    </div>
  );

  const renderGatewaySection = () => (
    <div className="mb-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
          🔗
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          Gateway Configuration
        </h3>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
              <span className="text-indigo-600">🆔</span>
              Client ID
            </label>
            <input
              type="text"
              className="modal-input-indigo"
              value={gatewayData.clientId}
              onChange={(e) =>
                handleGatewayInputChange("clientId", e.target.value)
              }
              placeholder="Enter client ID"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
              <span className="text-indigo-600">🔑</span>
              Access Token
            </label>
            <input
              type="text"
              className="modal-input-indigo"
              value={gatewayData.accessToken}
              onChange={(e) =>
                handleGatewayInputChange("accessToken", e.target.value)
              }
              placeholder="Enter access token"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
            <span className="text-indigo-600">🔐</span>
            Lock ID
          </label>
          <input
            type="text"
            className="modal-input-indigo"
            value={gatewayData.lockId}
            onChange={(e) => handleGatewayInputChange("lockId", e.target.value)}
            placeholder="Enter lock ID"
          />
        </div>
      </div>
    </div>
  );

  const renderCardSection = () => (
    <div className="mb-8 p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border border-cyan-200 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
          💳
        </div>
        <h3 className="text-lg font-bold text-slate-800">Card Information</h3>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
              <span className="text-cyan-600">🔢</span>
              Card Number
            </label>
            <input
              type="text"
              className="modal-input-cyan"
              value={
                selectedType === "offline"
                  ? offlineData.cardNumber
                  : gatewayData.cardNumber
              }
              onChange={(e) =>
                selectedType === "offline"
                  ? handleOfflineInputChange("cardNumber", e.target.value)
                  : handleGatewayInputChange("cardNumber", e.target.value)
              }
              placeholder="Enter card number"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
              <span className="text-cyan-600">📝</span>
              Card Name
            </label>
            <input
              type="text"
              className="modal-input-cyan"
              value={
                selectedType === "offline"
                  ? offlineData.cardName
                  : gatewayData.cardName
              }
              onChange={(e) =>
                selectedType === "offline"
                  ? handleOfflineInputChange("cardName", e.target.value)
                  : handleGatewayInputChange("cardName", e.target.value)
              }
              placeholder="Enter card name"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
              <span className="text-cyan-600">📱</span>
              Card Type
            </label>
            <select
              className="modal-input-cyan modal-select"
              value={
                selectedType === "offline"
                  ? offlineData.cardType
                  : gatewayData.cardType
              }
              onChange={(e) =>
                selectedType === "offline"
                  ? handleOfflineInputChange("cardType", e.target.value)
                  : handleGatewayInputChange("cardType", e.target.value)
              }
            >
              <option value="">Select card type</option>
              <option value="keycard">🔑 Keycard</option>
              <option value="master">👑 Master</option>
              <option value="guest">🎫 Guest</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
              <span className="text-cyan-600">➕</span>
              Add Type
            </label>
            <select
              className="modal-input-cyan modal-select"
              value={
                selectedType === "offline"
                  ? offlineData.addType
                  : gatewayData.addType
              }
              onChange={(e) =>
                selectedType === "offline"
                  ? handleOfflineInputChange("addType", e.target.value)
                  : handleGatewayInputChange("addType", e.target.value)
              }
            >
              <option value="">Select add type</option>
              <option value="permanent">∞ Permanent</option>
              <option value="temporary">⏱️ Temporary</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTimeSection = () => (
    <div className="mb-8 p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border border-pink-200 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
          ⏰
        </div>
        <h3 className="text-lg font-bold text-slate-800">Time Configuration</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
            <span className="text-pink-600">🚀</span>
            Start Date & Time
          </label>
          <input
            type="datetime-local"
            className="modal-input-pink"
            value={
              selectedType === "offline"
                ? offlineData.startDate
                : gatewayData.startDate
            }
            onChange={(e) =>
              selectedType === "offline"
                ? handleOfflineInputChange("startDate", e.target.value)
                : handleGatewayInputChange("startDate", e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
            <span className="text-pink-600">⏳</span>
            Expire Date & Time
          </label>
          <input
            type="datetime-local"
            className="modal-input-pink"
            value={
              selectedType === "offline"
                ? offlineData.expireDate
                : gatewayData.expireDate
            }
            onChange={(e) =>
              selectedType === "offline"
                ? handleOfflineInputChange("expireDate", e.target.value)
                : handleGatewayInputChange("expireDate", e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-[999999] p-4 animate-in fade-in duration-200"
      onClick={onClose}
      style={{
        transform: "translateZ(0)",
        willChange: "transform",
        isolation: "isolate",
      }}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in slide-in-from-bottom-4 fade-in duration-300 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      >
        <div className="sticky top-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-t-3xl flex justify-between items-center z-10 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg animate-pulse">
              🔑
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">
                Key Encoding Assistant
              </h2>
              <p className="text-sm text-slate-300">
                Configure your smart lock credentials
              </p>
            </div>
          </div>
          <button
            className="w-12 h-12 bg-white/10 border border-white/20 text-white rounded-full transition-all duration-200 hover:bg-white/20 hover:scale-110 active:scale-95 flex items-center justify-center text-xl font-bold"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="p-8 bg-gradient-to-br from-slate-50 to-white">
          {renderTypeSelection()}
          {selectedType === "gateway" && renderGuestSection()}
          {selectedType && renderLocationSection()}
          {selectedType === "offline" && renderSystemSection()}
          {selectedType === "gateway" && renderGatewaySection()}
          {selectedType && renderCardSection()}
          {selectedType && renderTimeSection()}
        </div>

        <div className="sticky bottom-0 flex justify-end gap-4 p-6 bg-white/90 border-t border-slate-200 rounded-b-3xl">
          <button
            className="px-6 py-3 border border-slate-300 bg-white rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-slate-50 hover:border-slate-400 active:scale-95 flex items-center gap-2 shadow-sm"
            onClick={onClose}
          >
            <span>❌</span>
            Cancel
          </button>
          <button
            className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg transform hover:scale-105 active:scale-95 ${
              selectedType
                ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 shadow-emerald-500/25"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleEncode}
            disabled={!selectedType}
          >
            <span>🚀</span>
            Encode Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
