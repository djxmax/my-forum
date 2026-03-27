import { useState } from "react";
import { Card } from "../core/Card";
import { Stack } from "../core/Stack";
import { Text } from "../core/Text";
import { Comment } from "../entities";
import { useAuthStore } from "../store/authStore";
import { ConfirmModal } from "./ConfirmModal";

type Props = {
  comment: Comment;
  onDelete?: () => void;
  onLike?: () => void;
};

export function CommentCard({ comment, onDelete, onLike }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const user = useAuthStore((s) => s.user);
  const liked = user ? comment.likes.includes(user.id) : false;
  console.log("user", user);

  return (
    <>
      <Card>
        <Stack spacing={2}>
          <div className="flex items-start justify-between">
            <Text variant="paragraph">{comment.text}</Text>
            {onDelete && (
              <button
                onClick={() => setShowConfirm(true)}
                className="text-red-500 hover:text-red-700 text-sm shrink-0 ml-4"
              >
                Supprimer
              </button>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
              Par {comment.author.username} •{" "}
              {new Date(comment.createdAt).toLocaleString()}
            </span>
            {onLike && (
              <button
                onClick={onLike}
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
                <span>{comment.likes.length}</span>
              </button>
            )}
          </div>
        </Stack>
      </Card>

      {showConfirm && (
        <ConfirmModal
          message="Supprimer ce commentaire ? Cette action est irréversible."
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
