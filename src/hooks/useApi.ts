import { useMutation } from "@tanstack/react-query";
import { apiService } from "../services/apiService";

export const useApiPost = (endpoint: string) => {
  return useMutation({
    mutationFn: async (data: any) => apiService.post(endpoint, data),
  });
};
