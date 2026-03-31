import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { AuthResponse, PasswordChange, UserRegister } from "../entities";

export function useLogin(onSuccess: () => void, onError: (err: any) => void) {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post<AuthResponse>("/auth/login", data),
    onSuccess: ({ data }) => {
      login(data.access_token, data.user);
      onSuccess();
    },
    onError,
  });
}

export function useRegister(
  onSuccess: () => void,
  onError: (err: any) => void,
) {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: (data: UserRegister) =>
      api.post<AuthResponse>("/auth/register", data),
    onSuccess: ({ data }) => {
      login(data.access_token, data.user);
      onSuccess();
    },
    onError,
  });
}

export function usePasswordChange(
  onSuccess: () => void,
  onError: (err: any) => void,
) {
  return useMutation({
    mutationFn: (data: PasswordChange) => api.patch("/auth/password", data),
    onSuccess: () => {
      onSuccess();
    },
    onError,
  });
}
