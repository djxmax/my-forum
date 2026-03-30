import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Stack } from "../core/Stack";
import { Text } from "../core/Text";
import { Button } from "../core/Button";

import { PostCard } from "../components/PostCard";
import { Pagination } from "../components/Pagination";
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
      <Pagination
        page={page}
        totalPages={posts?.totalPages}
        total={posts?.total}
        totalLabel="post(s)"
        isLoading={isLoading}
        onPrev={() => setPage((old) => old - 1)}
        onNext={() => setPage((old) => old + 1)}
      />
    </Stack>
  );
}
