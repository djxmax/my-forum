import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "../core/Card";
import { Stack } from "../core/Stack";
import { Text } from "../core/Text";
import { Button } from "../core/Button";
import { Input } from "../core/Input";
import { useCreatePost } from "../hooks/usePosts";

export default function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", text: "" });
  const [error, setError] = useState("");

  const mutation = useCreatePost(
    () => navigate("/"),
    (err: any) =>
      setError(err.response?.data?.message ?? "Une erreur est survenue"),
  );

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    mutation.mutate(form);
  };

  return (
    <Stack spacing={6}>
      <Link to="/" className="text-primary-600 hover:underline text-sm">
        ← Retour aux posts
      </Link>

      <Card>
        <Stack spacing={4}>
          <Text variant="title">Nouveau post</Text>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <Input
                id="title"
                label="Titre"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Titre du post"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                  Contenu
                </label>
                <textarea
                  rows={6}
                  required
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  placeholder="Contenu du post..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={mutation.isPending || !form.title || !form.text}
                >
                  {mutation.isPending ? "Publication..." : "Publier"}
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Annuler
                </Button>
              </div>
            </Stack>
          </form>
        </Stack>
      </Card>
    </Stack>
  );
}
