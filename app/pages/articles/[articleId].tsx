import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getArticle from "app/articles/queries/getArticle"
import deleteArticle from "app/articles/mutations/deleteArticle"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

export const Article = () => {
  const router = useRouter()
  const articleId = useParam("articleId", "number")
  const [deleteArticleMutation] = useMutation(deleteArticle)
  const [article] = useQuery(getArticle, { id: articleId })
  const currentUser = useCurrentUser()

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
