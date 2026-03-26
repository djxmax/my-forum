import { useState } from "react";
import { Card } from "../core/Card";
import { Stack } from "../core/Stack";
import { Text } from "../core/Text";
import { Post } from "../entities";
import { ConfirmModal } from "./ConfirmModal";

type Props = {
  post: Post;
  onDelete?: () => void;
  onClick?: () => void;
  compact?: boolean;
};

export function PostCard({ post, onDelete, onClick, compact }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

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
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Par {post.author.username}</span>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleString()}</span>
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
