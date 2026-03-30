import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import api from "../lib/api";
import { PaginatedResponse, Post } from "../entities";

export function usePosts(page = 0, limit = 10) {
  return useQuery({
    queryKey: ["posts", page, limit],
    queryFn: () =>
      api
        .get<PaginatedResponse<Post>>("/posts", { params: { page, limit } })
        .then((r) => r.data),
    placeholderData: keepPreviousData,
  });
}

export function usePost(id: string | undefined) {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: () => api.get<Post>(`/posts/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreatePost(
  onSuccess: () => void,
  onError: (err: any) => void,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; text: string }) =>
      api.post("/posts", data),
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
    mutationFn: () => api.post("/likes", { parentId: id, parentType: "post" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts", id] }),
  });
}
