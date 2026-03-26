import { Card } from "../core/Card";
import { Stack } from "../core/Stack";
import { Button } from "../core/Button";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isPending: boolean;
};

export function CommentForm({ value, onChange, onSubmit, isPending }: Props) {
  return (
    <Card>
      <Stack spacing={3}>
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Écrire un commentaire..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <Button onClick={onSubmit} disabled={isPending || !value} size="sm">
          {isPending ? "Envoi..." : "Commenter"}
        </Button>
      </Stack>
    </Card>
  );
}
