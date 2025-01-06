import prisma from "@@/server/prisma"
export default defineEventHandler(async (event) => {
  const schema = z.object({
    id: z.string().transform(Number),
    // size: z.string().optional().default('10').transform(Number),
    // qc: z.string().optional().default('0').transform(Number)
  })
  const query = await useSafeValidatedQuery(event, schema)
  
  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? '参数错误'
    })
  }

  // 获取某个 memo 的点赞数
  const count = await prisma.likes.count({
    where: {
      memo_id: query.data.id
    }
  })

  return {
    data: count,
    msg: 'ok'
  }
})