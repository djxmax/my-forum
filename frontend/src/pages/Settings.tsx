import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";
import { Card } from "../core/Card";
import { Stack } from "../core/Stack";
import { Text } from "../core/Text";
import { Input } from "../core/Input";
import { Button } from "../core/Button";

export default function Settings() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: () =>
      api.patch("/auth/password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }),
    onSuccess: () => {
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (err: any) => {
      setError(err.response?.data?.message ?? "Une erreur est survenue");
    },
  });

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (form.newPassword !== form.confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas");
      return;
    }
    mutation.mutate();
  };

  return (
    <Stack spacing={6}>
      <Text variant="title">Paramètres du compte</Text>

      <Card>
        <Stack spacing={4}>
          <Text variant="subtitle">Changer le mot de passe</Text>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm dark:bg-green-900/20 dark:text-green-400">
              Mot de passe mis à jour avec succès.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <Input
                id="currentPassword"
                label="Mot de passe actuel"
                type="password"
                required
                placeholder="••••••••"
                value={form.currentPassword}
                onChange={(e) =>
                  setForm({ ...form, currentPassword: e.target.value })
                }
              />
              <Input
                id="newPassword"
                label="Nouveau mot de passe"
                type="password"
                required
                placeholder="••••••••"
                value={form.newPassword}
                onChange={(e) =>
                  setForm({ ...form, newPassword: e.target.value })
                }
              />
              <Input
                id="confirmPassword"
                label="Confirmer le nouveau mot de passe"
                type="password"
                required
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                errorLabel={
                  form.confirmPassword &&
                  form.newPassword !== form.confirmPassword
                    ? "Les mots de passe ne correspondent pas"
                    : undefined
                }
              />
              <Button
                type="submit"
                disabled={
                  mutation.isPending ||
                  !form.currentPassword ||
                  !form.newPassword ||
                  !form.confirmPassword
                }
              >
                {mutation.isPending ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Card>
    </Stack>
  );
}
