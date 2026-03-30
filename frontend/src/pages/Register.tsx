import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "../core/Card";
import { Stack } from "../core/Stack";
import { Text } from "../core/Text";
import { Input } from "../core/Input";
import { Button } from "../core/Button";
import { Center } from "../core/Center";
import { useRegister } from "../hooks/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const mutation = useRegister(
    () => navigate("/"),
    (err: any) => setError(err.response?.data?.message ?? "An error occurred"),
  );

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    mutation.mutate(form);
  };

  return (
    <Center>
      <div className="w-full max-w-md">
        <Card>
          <Stack spacing={6}>
            <Text variant="title">Créer un compte</Text>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <Input
                  id="username"
                  label="Nom"
                  type="text"
                  required
                  placeholder="johndoe"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Input
                  id="password"
                  label="Mot de passe"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <Input
                  id="confirmPassword"
                  label="Confirmer le mot de passe"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  errorLabel={
                    form.confirmPassword &&
                    form.password !== form.confirmPassword
                      ? "Les mots de passe ne correspondent pas"
                      : undefined
                  }
                />
                <Button type="submit" disabled={mutation.isPending} size="lg">
                  {mutation.isPending
                    ? "Création du compte..."
                    : "Créer le compte"}
                </Button>
              </Stack>
            </form>

            <Text variant="paragraph">
              Vous avez déjà un compte ?{" "}
              <Link to="/login" className="text-primary-600 hover:underline">
                Se connecter
              </Link>
            </Text>
          </Stack>
        </Card>
      </div>
    </Center>
  );
}
