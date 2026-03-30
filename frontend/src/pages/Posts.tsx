import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Stack } from "../core/Stack";
import { Text } from "../core/Text";
import { Button } from "../core/Button";
import { PostCard } from "../components/PostCard";
import { usePosts } from "../hooks/usePosts";
import { useState } from "react";

export default function Posts() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [page, setPage] = useState(0);
  const { data: posts, isLoading } = usePosts(page);

  if (isLoading) return <Text variant="paragraph">Chargement...</Text>;

  return (
    <Stack spacing={6}>
      <div className="flex items-center justify-between">
        <Text variant="title">Forum</Text>
        {isAuthenticated && (
          <Button onClick={() => navigate("/posts/new")}>Nouveau post</Button>
        )}
      </div>

      {/* Liste des posts */}
      {posts?.data?.length === 0 && (
        <Text variant="paragraph">Aucun post pour le moment.</Text>
      )}
      {posts?.data?.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          compact
          onClick={() => navigate(`/posts/${post.id}`)}
        />
      ))}
      <div className="flex w-full">
        <div className="basis-1/3 flex justify-start">
          <Button
            size="xl"
            disabled={page == 0}
            onClick={() => setPage((old) => old - 1)}
          >
            Précédent
          </Button>
        </div>
        <div className="basis-1/3 flex justify-center items-center">
          <Text>
            Page {page + 1} sur {posts?.totalPages} - {posts?.total} posts
          </Text>
        </div>
        <div className="basis-1/3 flex justify-end">
          <Button
            size="xl"
            disabled={isLoading || posts?.totalPages == page + 1}
            onClick={() => setPage((old) => old + 1)}
          >
            Suivant
          </Button>
        </div>
      </div>
    </Stack>
  );
}
