import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { Stack } from "../core/Stack";
import { Text } from "../core/Text";
import { Post, Comment } from "../entities";
import { PostCard } from "../components/PostCard";
import { CommentCard } from "../components/CommentCard";
import { CommentForm } from "../components/CommentForm";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  console.log("user", user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [comment, setComment] = useState("");

  // Récupère le post
  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => api.get<Post>(`/posts/${id}`).then((r) => r.data),
  });

  // Récupère les commentaires
  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", id],
    queryFn: () =>
      api.get<Comment[]>(`/comments/post/${id}`).then((r) => r.data),
  });

  // Créer un commentaire
  const createComment = useMutation({
    mutationFn: () => api.post("/comments", { text: comment, postId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      setComment("");
    },
  });

  // Supprimer un commentaire
  const deleteComment = useMutation({
    mutationFn: (commentId: string) => api.delete(`/comments/${commentId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", id] }),
  });

  // Supprimer le post
  const deletePost = useMutation({
    mutationFn: () => api.delete(`/posts/${id}`),
    onSuccess: () => navigate("/"),
  });

  if (postLoading) return <Text variant="paragraph">Chargement...</Text>;
  if (!post) return <Text variant="paragraph">Post introuvable.</Text>;

  return (
    <Stack spacing={6}>
      {/* Bouton retour */}
      <Link to="/" className="text-primary-600 hover:underline text-sm">
        ← Retour aux posts
      </Link>

      {/* Post */}
      <PostCard
        post={post}
        onDelete={
          user?.id === post.author.id ? () => deletePost.mutate() : undefined
        }
      />

      <Stack spacing={2}>
        {/* Commentaires */}
        <Text variant="subtitle">
          Commentaires ({commentsLoading ? "..." : (comments?.length ?? 0)})
        </Text>
        {/* Liste des commentaires */}
        {comments?.length === 0 && (
          <Text variant="paragraph">Aucun commentaire pour le moment.</Text>
        )}
        {comments?.map((c) => (
          <CommentCard
            key={c.id}
            comment={c}
            onDelete={
              user?.id === c.author.id
                ? () => deleteComment.mutate(c.id)
                : undefined
            }
          />
        ))}

        {/* Formulaire de commentaire */}
        {isAuthenticated && (
          <CommentForm
            value={comment}
            onChange={setComment}
            onSubmit={() => createComment.mutate()}
            isPending={createComment.isPending}
          />
        )}
      </Stack>
    </Stack>
  );
}
