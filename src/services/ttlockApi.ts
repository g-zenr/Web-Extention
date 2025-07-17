import {
  GatewayEncodeRequest,
  GatewayEncodeResponse,
  GatewayData,
} from "../types/ttlock";

class TTLockApiService {
  private baseUrl: string;
  private defaultClientId: string;
  private defaultAccessToken: string;
  private defaultLockId: string;
  private defaultCardType: number;
  private defaultAddType: number;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = "http://localhost:3000") {
    this.baseUrl = baseUrl;
    this.defaultClientId = "2a36101d46ec4a5c9971c9fc982bc07f";
    this.defaultAccessToken = "cc2dd045936fadf231ac4b6ede131a57";
    this.defaultLockId = "23939120";
    this.defaultCardType = 1;
    this.defaultAddType = 2;
    this.defaultHeaders = {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      Connection: "keep-alive",
      "Content-Type": "application/json",
      Origin: "http://localhost:5173",
      Referer: "http://localhost:5173/",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36",
      "sec-ch-ua":
        '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
    };
  }

  /**
   * Encode a key for gateway/online mode
   */
  async encodeGatewayKey(
    data: GatewayEncodeRequest
  ): Promise<GatewayEncodeResponse> {
    try {
      console.log("🌐 Calling TTLock API for gateway encoding:", data);

      const response = await fetch(
        `${this.baseUrl}/api/ttlock/ic-card/public`,
        {
          method: "POST",
          headers: this.defaultHeaders,
          body: JSON.stringify(data),
        }
      );

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
    // Determine if it's permanent based on addType
    const isPermanent = formData.addType.toLowerCase() === "permanent";

    // Handle date logic based on permanent/temporary
    let startDate: number;
    let endDate: number;

    if (isPermanent) {
      // For permanent cards, use 0 for both dates
      startDate = 0;
      endDate = 0;
      console.log("🔄 Permanent card detected - setting dates to 0");
    } else {
      // For temporary cards, convert to unix timestamp
      startDate = this.convertToTimestamp(formData.startDate);
      endDate = this.convertToTimestamp(formData.expireDate);
      console.log(
        "⏰ Temporary card detected - converting dates to timestamps",
        {
          startDate,
          endDate,
        }
      );
    }

    return {
      clientId: this.defaultClientId, // Use pre-set value
      accessToken: this.defaultAccessToken, // Use pre-set value
      lockId: this.defaultLockId, // Use pre-set value
      cardNumber: formData.cardNumber,
      cardName: formData.cardName || formData.guestName, // Use cardName if provided, otherwise guestName
      cardType: this.defaultCardType, // Use pre-set value (1)
      addType: this.defaultAddType, // Use pre-set value (2)
      startDate: startDate,
      endDate: endDate,
    };
  }

  /**
   * Map card type string to number (kept for backward compatibility)
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
   * Map add type string to number (kept for backward compatibility)
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

  /**
   * Get the pre-set default values (for display purposes)
   */
  getDefaultValues() {
    return {
      clientId: this.defaultClientId,
      accessToken: this.defaultAccessToken,
      lockId: this.defaultLockId,
      cardType: this.defaultCardType,
      addType: this.defaultAddType,
    };
  }

  /**
   * Get the default headers (for debugging purposes)
   */
  getDefaultHeaders() {
    return { ...this.defaultHeaders };
  }
}

// Create a singleton instance
export const ttlockApiService = new TTLockApiService();
