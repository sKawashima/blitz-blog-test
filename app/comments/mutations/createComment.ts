import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateComment = z.object({
  name: z.string(),
  body: z.string(),
  article: z.object({
    connect: z.object({
      id: z.number(),
    }),
  }),
})

export default resolver.pipe(resolver.zod(CreateComment), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const comment = await db.comment.create({ data: input })

  return comment
})
