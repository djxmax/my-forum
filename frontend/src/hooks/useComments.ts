import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import api from "../lib/api";
import { Comment, PaginatedResponse } from "../entities";

export function useComments(postId: string | undefined, page = 0, limit = 10) {
  return useQuery({
    queryKey: ["comments", postId, page, limit],
    queryFn: () =>
      api
        .get<
          PaginatedResponse<Comment>
        >(`/comments/post/${postId}?page=${page}&limit=${limit}`)
        .then((r) => r.data),
    enabled: !!postId,
    placeholderData: keepPreviousData,
    staleTime: 5000,
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
