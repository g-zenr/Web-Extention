import React, { useState, useEffect } from "react";
import {
  ModalProps,
  OfflineData,
  GatewayData,
  TTLockData,
} from "../types/ttlock";
import { ttlockApiService } from "../services/ttlockApi";

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

  // Pre-populate the default values when component mounts
  useEffect(() => {
    const defaultValues = ttlockApiService.getDefaultValues();
    setGatewayData((prev) => ({
      ...prev,
      clientId: defaultValues.clientId,
      accessToken: defaultValues.accessToken,
      lockId: defaultValues.lockId,
      cardType: "keycard", // Default to keycard (maps to 1)
      addType: "temporary", // Default to temporary (maps to 2)
    }));
    setOfflineData((prev) => ({
      ...prev,
      cardType: "keycard", // Default to keycard (maps to 1)
      addType: "temporary", // Default to temporary (maps to 2)
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
        (!offlineData.startDate && offlineData.addType !== "permanent") ||
        (!offlineData.expireDate && offlineData.addType !== "permanent")
      ) {
        alert("Please fill in all required offline fields");
        return;
      }
      onEncode({ type: "offline", ...offlineData });
    } else {
      // Validate gateway fields (excluding pre-set values)
      if (
        !gatewayData.guestName ||
        !gatewayData.roomNumber ||
        !gatewayData.buildingNumber ||
        !gatewayData.floorNumber ||
        !gatewayData.cardNumber ||
        !gatewayData.cardName ||
        (!gatewayData.startDate && gatewayData.addType !== "permanent") ||
        (!gatewayData.expireDate && gatewayData.addType !== "permanent")
      ) {
        alert("Please fill in all required gateway fields");
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
              Client ID (Pre-configured)
            </label>
            <input
              type="text"
              className="modal-input-indigo"
              value={gatewayData.clientId}
              readOnly
              style={{ backgroundColor: "#f8fafc", cursor: "not-allowed" }}
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
              <span className="text-indigo-600">🔑</span>
              Access Token (Pre-configured)
            </label>
            <input
              type="text"
              className="modal-input-indigo"
              value={gatewayData.accessToken}
              readOnly
              style={{ backgroundColor: "#f8fafc", cursor: "not-allowed" }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
            <span className="text-indigo-600">🔐</span>
            Lock ID (Pre-configured)
          </label>
          <input
            type="text"
            className="modal-input-indigo"
            value={gatewayData.lockId}
            readOnly
            style={{ backgroundColor: "#f8fafc", cursor: "not-allowed" }}
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
              Card Type (Pre-configured: Keycard)
            </label>
            <input
              type="text"
              className="modal-input-cyan"
              value="🔑 Keycard"
              readOnly
              style={{ backgroundColor: "#f8fafc", cursor: "not-allowed" }}
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
              <span className="text-cyan-600">➕</span>
              Add Type (Default: Temporary)
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
              <option value="temporary">⏱️ Temporary</option>
              <option value="permanent">∞ Permanent</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTimeSection = () => {
    const currentAddType =
      selectedType === "offline" ? offlineData.addType : gatewayData.addType;
    const isPermanent = currentAddType === "permanent";

    return (
      <div className="mb-8 p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border border-pink-200 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
            ⏰
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Time Configuration
          </h3>
        </div>

        {isPermanent ? (
          <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
            <div className="text-4xl mb-2">∞</div>
            <h4 className="text-lg font-semibold text-blue-800 mb-2">
              Permanent Access
            </h4>
            <p className="text-blue-600 text-sm">
              This card will have permanent access with no expiration date.
              <br />
              Start and end dates will be set to 0 automatically.
            </p>
          </div>
        ) : (
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
        )}
      </div>
    );
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        padding: "1rem",
        pointerEvents: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          borderRadius: "1.5rem",
          width: "100%",
          maxWidth: "56rem",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          position: "relative",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            background: "linear-gradient(to right, #0f172a, #1e293b, #0f172a)",
            color: "white",
            padding: "1.5rem",
            borderTopLeftRadius: "1.5rem",
            borderTopRightRadius: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10,
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "3.5rem",
                height: "3.5rem",
                background:
                  "linear-gradient(to bottom right, #facc15, #f97316)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
            >
              🔑
            </div>
            <div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "0.25rem",
                }}
              >
                Key Encoding Assistant
              </h2>
              <p style={{ fontSize: "0.875rem", color: "#cbd5e1" }}>
                Configure your smart lock credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "3rem",
              height: "3rem",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
              borderRadius: "50%",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.25rem",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            padding: "2rem",
            background: "linear-gradient(to bottom right, #f8fafc, white)",
          }}
        >
          {renderTypeSelection()}
          {selectedType === "gateway" && renderGuestSection()}
          {selectedType && renderLocationSection()}
          {selectedType === "offline" && renderSystemSection()}
          {selectedType === "gateway" && renderGatewaySection()}
          {selectedType && renderCardSection()}
          {selectedType && renderTimeSection()}
        </div>

        <div
          style={{
            position: "sticky",
            bottom: 0,
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
            padding: "1.5rem",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderTop: "1px solid #e2e8f0",
            borderBottomLeftRadius: "1.5rem",
            borderBottomRightRadius: "1.5rem",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "0.75rem 1.5rem",
              border: "1px solid #cbd5e1",
              backgroundColor: "white",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              cursor: "pointer",
            }}
          >
            <span>❌</span>
            Cancel
          </button>
          <button
            onClick={handleEncode}
            disabled={!selectedType}
            style={{
              padding: "0.75rem 2rem",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              cursor: selectedType ? "pointer" : "not-allowed",
              background: selectedType
                ? "linear-gradient(to right, #10b981, #059669)"
                : "#d1d5db",
              color: selectedType ? "white" : "#9ca3af",
              border: "none",
            }}
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
