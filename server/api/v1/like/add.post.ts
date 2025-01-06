import prisma from "@@/server/prisma"

export default defineEventHandler( async (event) => {
  // 新增一个点赞，可能是对文章、评论、子评论、备忘录的点赞
  const body = await useSafeValidatedBody(event, z.object({
    user_id: z.number(), 
    target: z.string(),
    memo_id: z.number().optional(),
    article_id: z.number().optional(),
    sub_comment_id: z.number().optional(),
    comment_id: z.number().optional()
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error)
    })
  }

  const data = await prisma.likes.create({
    data: {
      ...body.data
    }
  })

  return {
    data,
    message: 'ok'
  }
})