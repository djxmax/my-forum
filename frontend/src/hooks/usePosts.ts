import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { Post } from "../entities";

export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => api.get<Post[]>("/posts").then((r) => r.data),
  });
}

export function usePost(id: string | undefined) {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: () => api.get<Post>(`/posts/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreatePost(onSuccess: () => void, onError: (err: any) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; text: string }) => api.post("/posts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onSuccess();
    },
    onError,
  });
}

export function useDeletePost(id: string | undefined, onSuccess: () => void) {
  return useMutation({
    mutationFn: () => api.delete(`/posts/${id}`),
    onSuccess,
  });
}

export function useLikePost(id: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.patch(`/posts/${id}/like`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts", id] }),
  });
}
