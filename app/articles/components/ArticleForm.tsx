import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"
import { Field } from "react-final-form"
import styles from "./index.module.sass"

export function ArticleForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="title" label="Title" placeholder="title" />
      <div className="labeledField">
        <label className={styles.label}>body</label>
        <Field name="body" component="textarea" placeholder="body" />
      </div>
    </Form>
  )
}
