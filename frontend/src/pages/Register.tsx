import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "../core/Card";
import { Stack } from "../core/Stack";
import { Text } from "../core/Text";
import { Input } from "../core/Input";
import { Button } from "../core/Button";
import { Center } from "../core/Center";
import { useRegister } from "../hooks/useAuth";
import { Formik, Form, Field, FieldProps } from "formik";
import { RegisterSchema, UserRegister } from "../entities";

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const mutation = useRegister(
    () => navigate("/"),
    (err: any) => setError(err.response?.data?.message ?? "An error occurred"),
  );

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

            <Formik
              initialValues={{
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={RegisterSchema}
              onSubmit={(values) => {
                const userRegister = {
                  username: values.username,
                  email: values.email,
                  password: values.password,
                } as UserRegister;
                mutation.mutate(userRegister);
              }}
            >
              <Form>
                <Stack spacing={4}>
                  <Field name="username">
                    {({ field, meta }: FieldProps) => (
                      <Input
                        {...field}
                        type="text"
                        label="Nom"
                        placeholder="johndoe"
                        errorLabel={
                          meta.touched && meta.error ? meta.error : undefined
                        }
                      />
                    )}
                  </Field>
                  <Field name="email">
                    {({ field, meta }: FieldProps) => (
                      <Input
                        {...field}
                        type="email"
                        label="Email"
                        placeholder="you@example.com"
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
                        placeholder="••••••••"
                        errorLabel={
                          meta.touched && meta.error ? meta.error : undefined
                        }
                      />
                    )}
                  </Field>
                  <Field name="confirmPassword">
                    {({ field, meta }: FieldProps) => (
                      <Input
                        {...field}
                        type="password"
                        label="Confirmer du mot de passe"
                        placeholder="••••••••"
                        errorLabel={
                          meta.touched && meta.error ? meta.error : undefined
                        }
                      />
                    )}
                  </Field>
                  <Button type="submit" disabled={mutation.isPending} size="lg">
                    {mutation.isPending
                      ? "Création du compte..."
                      : "Créer un compte"}
                  </Button>
                </Stack>
              </Form>
            </Formik>

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
