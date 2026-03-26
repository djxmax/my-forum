import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { Card } from "../core/Card";
import { Stack } from "../core/Stack";
import { Text } from "../core/Text";
import { Button } from "../core/Button";
import { Post, Comment } from "../entities";
import { PostCard } from "../components/PostCard";
import { CommentCard } from "../components/CommentCard";

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

      {/* Commentaires */}
      <Text variant="subtitle">
        Commentaires ({commentsLoading ? "..." : (comments?.length ?? 0)})
      </Text>

      {/* Formulaire de commentaire */}
      {isAuthenticated && (
        <Card>
          <Stack spacing={3}>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Écrire un commentaire..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button
              onClick={() => createComment.mutate()}
              disabled={createComment.isPending || !comment}
              size="sm"
            >
              {createComment.isPending ? "Envoi..." : "Commenter"}
            </Button>
          </Stack>
        </Card>
      )}

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
    </Stack>
  );
}
