import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes, useMutation } from "blitz"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import Layout from "app/core/layouts/Layout"
import getArticles from "app/articles/queries/getArticles"
import logout from "app/auth/mutations/logout"

const ITEMS_PER_PAGE = 100

export const ArticlesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ articles, hasMore }] = usePaginatedQuery(getArticles, {
    orderBy: { id: "desc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })
  const currentUser = useCurrentUser()

  return (
    <div>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            <Link href={Routes.ShowArticlePage({ articleId: article.id })}>
              <a>
                {article.title} <span>{article.updatedAt.toString()}</span>
                {currentUser ? (
                  <Link href={Routes.EditArticlePage({ articleId: article.id })}>edit</Link>
                ) : (
                  ""
                )}
              </a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const Top: BlitzPage = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)
  return (
    <>
      <Head>
        <title>Articles</title>
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <ArticlesList />
        </Suspense>
      </div>
      {currentUser ? (
        <>
          <Link href={Routes.NewArticlePage()}>New article</Link>
          <button
            className="button small"
            onClick={async () => {
              await logoutMutation()
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <Link href={Routes.LoginPage()}>login</Link>
      )}
    </>
  )
}

Top.getLayout = (page) => <Layout>{page}</Layout>

export default Top
