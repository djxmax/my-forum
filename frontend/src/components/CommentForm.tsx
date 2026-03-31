import { Card } from "../core/Card";
import { Stack } from "../core/Stack";
import { Button } from "../core/Button";
import { Formik, Form, Field, FieldProps } from "formik";
import { CreateCommentSchema } from "../entities";
import { Textarea } from "../core/Textarea";

type Props = {
  onSubmit: (value: string, resetForm: () => void) => void;
  isPending: boolean;
};

export function CommentForm({ onSubmit, isPending }: Props) {
  return (
    <Card>
      <Formik
        initialValues={{
          text: "",
        }}
        validationSchema={CreateCommentSchema}
        onSubmit={(values, { resetForm }) => {
          onSubmit(values.text, resetForm);
        }}
      >
        <Form>
          <Stack spacing={3}>
            <Field name="text">
              {({ field, meta }: FieldProps) => (
                <Textarea
                  {...field}
                  label="Contenu"
                  placeholder="Contenu du commentaire"
                  errorLabel={
                    meta.touched && meta.error ? meta.error : undefined
                  }
                />
              )}
            </Field>
            <Button type="submit" disabled={isPending} size="lg">
              {isPending ? "Publication..." : "Publier"}
            </Button>
          </Stack>
        </Form>
      </Formik>
    </Card>
  );
}
