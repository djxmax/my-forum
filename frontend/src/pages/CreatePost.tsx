import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "../core/Card";
import { Stack } from "../core/Stack";
import { Text } from "../core/Text";
import { Button } from "../core/Button";
import { Input } from "../core/Input";
import { useCreatePost } from "../hooks/usePosts";
import { Formik, Form, Field, FieldProps } from "formik";
import { CreatePostSchema } from "../entities";
import { Textarea } from "../core/Textarea";

export default function CreatePost() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const mutation = useCreatePost(
    () => navigate("/"),
    (err: any) =>
      setError(err.response?.data?.message ?? "Une erreur est survenue"),
  );

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

          <Formik
            initialValues={{
              title: "",
              text: "",
            }}
            validationSchema={CreatePostSchema}
            onSubmit={(values) => {
              mutation.mutate(values);
            }}
          >
            <Form>
              <Stack spacing={4}>
                <Field name="title">
                  {({ field, meta }: FieldProps) => (
                    <Input
                      {...field}
                      type="text"
                      label="Titre"
                      placeholder="Titre du post"
                      errorLabel={
                        meta.touched && meta.error ? meta.error : undefined
                      }
                    />
                  )}
                </Field>
                <Field name="text">
                  {({ field, meta }: FieldProps) => (
                    <Textarea
                      {...field}
                      label="Contenu"
                      placeholder="Contenu du post"
                      errorLabel={
                        meta.touched && meta.error ? meta.error : undefined
                      }
                    />
                  )}
                </Field>
                <Button type="submit" disabled={mutation.isPending} size="lg">
                  {mutation.isPending ? "Publication..." : "Publier"}
                </Button>
              </Stack>
            </Form>
          </Formik>
        </Stack>
      </Card>
    </Stack>
  );
}
