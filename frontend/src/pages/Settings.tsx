import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";
import { Card } from "../core/Card";
import { Stack } from "../core/Stack";
import { Text } from "../core/Text";
import { Input } from "../core/Input";
import { Button } from "../core/Button";
import { Formik, Form, Field, FieldProps } from "formik";
import { PasswordChange, PasswordChangeSchema } from "../entities";
import { usePasswordChange } from "../hooks/useAuth";

export default function Settings() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const resetFormRef = useRef<() => void>(null);

  const mutation = usePasswordChange(
    () => {
      setSuccess(true);
      resetFormRef.current?.();
    },
    (err: any) => {
      setError(err.response?.data?.message ?? "Une erreur est survenue");
    },
  );

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

          <Formik
            initialValues={{
              currentPassword: "",
              newPassword: "",
              confirmNewPassword: "",
            }}
            validationSchema={PasswordChangeSchema}
            onSubmit={(values, { resetForm }) => {
              resetFormRef.current = resetForm;
              const userRegister = {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
              } as PasswordChange;
              mutation.mutate(userRegister);
            }}
          >
            <Form>
              <Stack spacing={4}>
                <Field name="currentPassword">
                  {({ field, meta }: FieldProps) => (
                    <Input
                      {...field}
                      type="password"
                      label="Mot de passe actuel"
                      placeholder="••••••••"
                      errorLabel={
                        meta.touched && meta.error ? meta.error : undefined
                      }
                    />
                  )}
                </Field>
                <Field name="newPassword">
                  {({ field, meta }: FieldProps) => (
                    <Input
                      {...field}
                      type="password"
                      label="Nouveau mot de passe"
                      placeholder="••••••••"
                      errorLabel={
                        meta.touched && meta.error ? meta.error : undefined
                      }
                    />
                  )}
                </Field>
                <Field name="confirmNewPassword">
                  {({ field, meta }: FieldProps) => (
                    <Input
                      {...field}
                      type="password"
                      label="Confirmer le nouveau mot de passe"
                      placeholder="••••••••"
                      errorLabel={
                        meta.touched && meta.error ? meta.error : undefined
                      }
                    />
                  )}
                </Field>
                <Button type="submit" disabled={mutation.isPending} size="lg">
                  {mutation.isPending
                    ? "Enregistrement en cours..."
                    : "Enregistrer"}
                </Button>
              </Stack>
            </Form>
          </Formik>
        </Stack>
      </Card>
    </Stack>
  );
}
