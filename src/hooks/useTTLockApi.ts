import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ttlockApiService } from "../services/ttlockApi";
import {
  GatewayEncodeRequest,
  GatewayEncodeResponse,
  GatewayData,
} from "../types/ttlock";

export const useTTLockEncode = () => {
  const queryClient = useQueryClient();

  return useMutation<GatewayEncodeResponse, Error, GatewayData>({
    mutationFn: async (data: GatewayData) => {
      const apiRequest = ttlockApiService.mapFormDataToApiRequest(data);
      return ttlockApiService.encodeGatewayKey(apiRequest);
    },
    onSuccess: (data) => {
      console.log("✅ TTLock encoding successful:", data);
      // Invalidate and refetch any related queries if needed
      // queryClient.invalidateQueries(['ttlock-keys']);
    },
    onError: (error) => {
      console.error("❌ TTLock encoding failed:", error);
    },
  });
};

export const useTTLockOfflineEncode = () => {
  return useMutation<void, Error, any>({
    mutationFn: async (data: any) => {
      // For offline mode, send initialization request
      console.log("🔑 Processing offline encoding:", data);

      const result = await ttlockApiService.sendInitializationRequest();

      if (!result.success) {
        throw new Error(result.message || "Initialization request failed");
      }

      return Promise.resolve();
    },
    onSuccess: () => {
      console.log("✅ Offline encoding processed");
    },
    onError: (error) => {
      console.error("❌ Offline encoding failed:", error);
    },
  });
};
