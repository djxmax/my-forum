import { useState } from "react";
import { Card } from "../core/Card";
import { Stack } from "../core/Stack";
import { Text } from "../core/Text";
import { Comment } from "../entities";
import { ConfirmModal } from "./ConfirmModal";

type Props = {
  comment: Comment;
  onDelete?: () => void;
};

export function CommentCard({ comment, onDelete }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

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
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Par {comment.author.username} •{" "}
            {new Date(comment.createdAt).toLocaleString()}
          </div>
        </Stack>
      </Card>

      {showConfirm && (
        <ConfirmModal
          message="Supprimer ce commentaire ? Cette action est irréversible."
          onConfirm={() => { setShowConfirm(false); onDelete!(); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
