import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { Comment, PaginatedResponse } from "../entities";

export function useComments(postId: string | undefined) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () =>
      api
        .get<PaginatedResponse<Comment>>(`/comments/post/${postId}`)
        .then((r) => r.data),
    enabled: !!postId,
  });
}

export function useCreateComment(
  postId: string | undefined,
  onSuccess: () => void,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => api.post("/comments", { text, postId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      onSuccess();
    },
  });
}

export function useDeleteComment(postId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => api.delete(`/comments/${commentId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", postId] }),
  });
}

export function useLikeComment(postId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) =>
      api.post("/likes", { parentId: commentId, parentType: "comment" }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", postId] }),
  });
}
