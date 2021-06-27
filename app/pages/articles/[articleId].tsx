import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getArticle from "app/articles/queries/getArticle"
import deleteArticle from "app/articles/mutations/deleteArticle"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { Form, FormProps, FORM_ERROR } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"
import { Field } from "react-final-form"
import createComment from "app/comments/mutations/createComment"

function CommentForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="name" label="" placeholder="ななしさん" />
      <div className="labeledField">
        <Field name="body" component="textarea" placeholder="コメント" />
      </div>
    </Form>
  )
}

export const Article = () => {
  const router = useRouter()
  const articleId = useParam("articleId", "number")
  const [deleteArticleMutation] = useMutation(deleteArticle)
  const [article] = useQuery(getArticle, { id: articleId })
  const currentUser = useCurrentUser()
  const [createCommentMutation] = useMutation(createComment)

  return (
    <>
      <Head>
        <title>\{article.title}</title>
      </Head>

      <div>
        {currentUser && (
          <>
            <Link href={Routes.EditArticlePage({ articleId: article.id })}>
              <a>Edit</a>
            </Link>

            <button
              type="button"
              onClick={async () => {
                if (window.confirm("This will be deleted")) {
                  await deleteArticleMutation({ id: article.id })
                  router.push(Routes.ArticlesPage())
                }
              }}
              style={{ marginLeft: "0.5rem" }}
            >
              Delete
            </button>
          </>
        )}
        <h1>{article.title}</h1>
        <p>{article.body}</p>

        <h2>Comment</h2>
        {article.Comment.length === 0 ? (
          <p>コメントはありません</p>
        ) : (
          <ul>
            {article.Comment.map((comment, i) => (
              <li key={`comment_${i}`}>
                {comment.name}: {comment.body}
              </li>
            ))}
          </ul>
        )}
        {articleId && (
          <CommentForm
            submitText="コメントを投稿する"
            onSubmit={async (values) => {
              try {
                await createCommentMutation({
                  name: values.name || "ななしさん",
                  body: values.body,
                  article: {
                    connect: {
                      id: articleId,
                    },
                  },
                })
              } catch (error) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
        )}
      </div>
    </>
  )
}

const ShowArticlePage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.Top()}>
          <a>Articles</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Article />
      </Suspense>
    </div>
  )
}

ShowArticlePage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowArticlePage
