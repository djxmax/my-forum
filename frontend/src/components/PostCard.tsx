import { useState } from "react";
import { Card } from "../core/Card";
import { Stack } from "../core/Stack";
import { Text } from "../core/Text";
import { Post } from "../entities";
import { useAuthStore } from "../store/authStore";
import { ConfirmModal } from "./ConfirmModal";

type Props = {
  post: Post;
  onDelete?: () => void;
  onClick?: () => void;
  onLike?: () => void;
  compact?: boolean;
};

export function PostCard({ post, onDelete, onClick, onLike, compact }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const user = useAuthStore((s) => s.user);
  const liked = false; // user ? post.likes.includes(user.id) : false;

  return (
    <>
      <Card
        onClick={onClick}
        className={
          onClick
            ? "cursor-pointer hover:border-gray-400 transition-colors"
            : undefined
        }
      >
        <div
          style={compact ? { maxHeight: 200, overflow: "hidden" } : undefined}
        >
          <Stack spacing={2}>
            <div className="flex items-start justify-between">
              <Text variant="subtitle">{post.title}</Text>
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowConfirm(true);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm shrink-0 ml-4"
                >
                  Supprimer le post
                </button>
              )}
            </div>
            <Text
              variant="paragraph"
              className={compact ? "line-clamp-3" : undefined}
            >
              {post.text}
            </Text>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span>Par {post.author.username}</span>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>
              {!compact && onLike && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLike();
                  }}
                  className={`flex items-center gap-1 transition-colors ${liked ? "text-red-500" : "hover:text-red-400"}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{post.likesCount}</span>
                </button>
              )}
            </div>
          </Stack>
        </div>
      </Card>

      {showConfirm && (
        <ConfirmModal
          message="Supprimer ce post ? Cette action est irréversible."
          onConfirm={() => {
            setShowConfirm(false);
            onDelete!();
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
