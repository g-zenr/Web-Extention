import {
  GatewayEncodeRequest,
  GatewayEncodeResponse,
  GatewayData,
} from "../types/ttlock";

class TTLockApiService {
  private baseUrl: string;

  constructor(baseUrl: string = "https://api.ttlock.com") {
    this.baseUrl = baseUrl;
  }

  /**
   * Encode a key for gateway/online mode
   */
  async encodeGatewayKey(
    data: GatewayEncodeRequest
  ): Promise<GatewayEncodeResponse> {
    try {
      console.log("🌐 Calling TTLock API for gateway encoding:", data);

      // Convert dates to timestamps if they're date strings
      const requestData = {
        ...data,
        startDate: this.convertToTimestamp(data.startDate),
        endDate: this.convertToTimestamp(data.endDate),
      };

      const response = await fetch(`${this.baseUrl}/v3/key/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Gateway encoding API response:", result);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("❌ Gateway encoding API error:", error);

      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Convert date string to timestamp (if needed)
   */
  private convertToTimestamp(dateValue: string | number): number {
    if (typeof dateValue === "number") {
      return dateValue;
    }

    if (typeof dateValue === "string" && dateValue) {
      const date = new Date(dateValue);
      return Math.floor(date.getTime() / 1000); // Convert to seconds
    }

    return 0; // Default to 0 if no date provided
  }

  /**
   * Map form data to API request format
   */
  mapFormDataToApiRequest(formData: GatewayData): GatewayEncodeRequest {
    return {
      clientId: formData.clientId,
      accessToken: formData.accessToken,
      lockId: formData.lockId,
      cardNumber: formData.cardNumber,
      cardName: formData.cardName || formData.guestName, // Use cardName if provided, otherwise guestName
      cardType: this.mapCardType(formData.cardType),
      addType: this.mapAddType(formData.addType),
      startDate: this.convertToTimestamp(formData.startDate),
      endDate: this.convertToTimestamp(formData.expireDate),
    };
  }

  /**
   * Map card type string to number
   */
  private mapCardType(cardType: string): number {
    switch (cardType.toLowerCase()) {
      case "keycard":
        return 1;
      case "master":
        return 2;
      case "guest":
        return 3;
      default:
        return 1; // Default to keycard
    }
  }

  /**
   * Map add type string to number
   */
  private mapAddType(addType: string): number {
    switch (addType.toLowerCase()) {
      case "permanent":
        return 1;
      case "temporary":
        return 2;
      default:
        return 2; // Default to temporary
    }
  }
}

// Create a singleton instance
export const ttlockApiService = new TTLockApiService();
