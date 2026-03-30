import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "../core/Card";
import { Stack } from "../core/Stack";
import { Text } from "../core/Text";
import { Input } from "../core/Input";
import { Button } from "../core/Button";
import { Center } from "../core/Center";
import { useLogin } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const mutation = useLogin(
    () => navigate("/"),
    (err: any) => setError(err.response?.data?.message ?? "Invalid credentials"),
  );

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    mutation.mutate(form);
  };

  return (
    <Center>
      <div className="w-full max-w-md">
        <Card>
          <Stack spacing={6}>
            <Text variant="title">Bienvenue</Text>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  required
                  placeholder="test@exemple.com"
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
                  errorLabel={error}
                />
                <Button type="submit" disabled={mutation.isPending} size="lg">
                  {mutation.isPending ? "Connexion..." : "Se connecter"}
                </Button>
              </Stack>
            </form>

            <Text variant="paragraph">
              <Link to="/register" className="text-primary-600 hover:underline">
                Créer un compte
              </Link>
            </Text>
          </Stack>
        </Card>
      </div>
    </Center>
  );
}
