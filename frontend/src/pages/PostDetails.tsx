import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Stack } from "../core/Stack";
import { Text } from "../core/Text";
import { PostCard } from "../components/PostCard";
import { CommentCard } from "../components/CommentCard";
import { CommentForm } from "../components/CommentForm";
import { usePost, useDeletePost, useLikePost } from "../hooks/usePosts";
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useLikeComment,
} from "../hooks/useComments";
import { Pagination } from "../components/Pagination";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [page, setPage] = useState(0);

  const { data: post, isLoading: postLoading } = usePost(id);
  const { data: comments, isLoading: commentsLoading } = useComments(
    id,
    page,
    5,
  );
  const createComment = useCreateComment(id, () => {
    let page = (comments?.totalPages ?? 1) - 1;
    if (page < 0) page = 0;
    setPage(page);
  });
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
        onDelete={
          user?.id === post.author.id ? () => deletePost.mutate() : undefined
        }
        onLike={isAuthenticated ? () => likePost.mutate() : undefined}
      />

      <Stack spacing={2}>
        {/* Commentaires */}
        <Text variant="subtitle">
          Commentaires ({commentsLoading ? "..." : (comments?.total ?? 0)})
        </Text>
        {/* Liste des commentaires */}
        {comments?.total === 0 && (
          <Text variant="paragraph">Aucun commentaire pour le moment.</Text>
        )}
        {comments?.data?.map((c) => (
          <CommentCard
            key={c.id}
            comment={c}
            onDelete={
              user?.id === c.author.id
                ? () => deleteComment.mutate(c.id)
                : undefined
            }
            onLike={
              isAuthenticated ? () => likeComment.mutate(c.id) : undefined
            }
          />
        ))}

        {/* Formulaire de commentaire */}
        {isAuthenticated && (
          <CommentForm
            onSubmit={(value, resetForm) =>
              createComment.mutate(value, { onSuccess: resetForm })
            }
            isPending={createComment.isPending}
          />
        )}
        <Pagination
          page={page}
          totalPages={comments?.totalPages}
          total={comments?.total}
          totalLabel="commentaires(s)"
          isLoading={commentsLoading}
          onPrev={() => setPage((old) => old - 1)}
          onNext={() => setPage((old) => old + 1)}
        />
      </Stack>
    </Stack>
  );
}
