import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { Stack } from "../core/Stack";
import { Text } from "../core/Text";
import { Button } from "../core/Button";
import { Post } from "../entities";
import { PostCard } from "../components/PostCard";

export default function Posts() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Récupère tous les posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => api.get<Post[]>("/posts").then((r) => r.data),
  });

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
      {posts?.length === 0 && (
        <Text variant="paragraph">Aucun post pour le moment.</Text>
      )}
      {posts?.map((post) => (
        <PostCard key={post.id} post={post} compact onClick={() => navigate(`/posts/${post.id}`)} />
      ))}
    </Stack>
  );
}
