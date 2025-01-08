import prisma from "@@/server/prisma"
export default defineEventHandler(async (event) => {
  const schema = z.object({
    tag: z.string().optional()
  })
  const query = await useSafeValidatedQuery(event, schema)
  
  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? '参数错误'
    })
  }

  const tags = await prisma.tags.findMany({
    where: {
      tag_name: {
        contains: query.data.tag
      }
    }
  })

  return {
    data: tags,
    msg: 'ok'
  }
})