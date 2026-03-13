import { useMutation } from "@tanstack/react-query";

import { apiPost } from "@/lib/apiClient";

export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      apiPost("/newsletter/subscribe", data),
  });
}
