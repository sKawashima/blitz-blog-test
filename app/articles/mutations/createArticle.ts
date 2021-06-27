import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateArticle = z.object({
  title: z.string(),
  body: z.string(),
  user: z.object({
    connect: z.object({
      id: z.number(),
    }),
  }),
})

export default resolver.pipe(resolver.zod(CreateArticle), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const article = await db.article.create({ data: input })

  return article
})
