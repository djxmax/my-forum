import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Stack } from "../core/Stack";
import { Text } from "../core/Text";
import { PostCard } from "../components/PostCard";
import { CommentCard } from "../components/CommentCard";
import { CommentForm } from "../components/CommentForm";
import { usePost, useDeletePost, useLikePost } from "../hooks/usePosts";
import { useComments, useCreateComment, useDeleteComment, useLikeComment } from "../hooks/useComments";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [comment, setComment] = useState("");

  const { data: post, isLoading: postLoading } = usePost(id);
  const { data: comments, isLoading: commentsLoading } = useComments(id);
  const createComment = useCreateComment(id, () => setComment(""));
  const deleteComment = useDeleteComment(id);
  const deletePost = useDeletePost(id, () => navigate("/"));
  const likePost = useLikePost(id);
  const likeComment = useLikeComment(id);

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
        onDelete={user?.id === post.author.id ? () => deletePost.mutate() : undefined}
        onLike={isAuthenticated ? () => likePost.mutate() : undefined}
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
            onDelete={user?.id === c.author.id ? () => deleteComment.mutate(c.id) : undefined}
            onLike={isAuthenticated ? () => likeComment.mutate(c.id) : undefined}
          />
        ))}

        {/* Formulaire de commentaire */}
        {isAuthenticated && (
          <CommentForm
            value={comment}
            onChange={setComment}
            onSubmit={() => createComment.mutate(comment)}
            isPending={createComment.isPending}
          />
        )}
      </Stack>
    </Stack>
  );
}
