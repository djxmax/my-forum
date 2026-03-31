import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "../core/Card";
import { Stack } from "../core/Stack";
import { Text } from "../core/Text";
import { Input } from "../core/Input";
import { Button } from "../core/Button";
import { Center } from "../core/Center";
import { useLogin } from "../hooks/useAuth";
import { Formik, Form, Field, FieldProps } from "formik";
import { LoginSchema } from "../entities";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const mutation = useLogin(
    () => navigate("/"),
    (err: any) =>
      setError(err.response?.data?.message ?? "Invalid credentials"),
  );

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

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={(values) => {
                mutation.mutate(values);
              }}
            >
              <Form>
                <Stack spacing={4}>
                  <Field name="email">
                    {({ field, meta }: FieldProps) => (
                      <Input
                        {...field}
                        type="email"
                        label="Email"
                        errorLabel={
                          meta.touched && meta.error ? meta.error : undefined
                        }
                      />
                    )}
                  </Field>
                  <Field name="password">
                    {({ field, meta }: FieldProps) => (
                      <Input
                        {...field}
                        type="password"
                        label="Mot de passe"
                        errorLabel={
                          meta.touched && meta.error ? meta.error : undefined
                        }
                      />
                    )}
                  </Field>
                  <Button type="submit" disabled={mutation.isPending} size="lg">
                    {mutation.isPending ? "Connexion..." : "Se connecter"}
                  </Button>
                </Stack>
              </Form>
            </Formik>

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
