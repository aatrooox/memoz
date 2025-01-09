import prisma from "@@/server/prisma"

// uid           String     @unique
//   content       String
//   create_ts     DateTime   @default(now())
//   updated_ts    DateTime   @updatedAt
//   tags          String     @default("[]")
//   visible       String     @default("public") // 可见性 public / group / private 
//   defalt_floded Boolean    @default(false) // 默认折起
//   flod_tip      String? // 折起时，在标题栏展示折起的原因
//   user_id       Int

export default defineEventHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    content: z.string(),
    tags: z.array(z.string()).optional(),
    visible: z.string().optional(),
    defalt_floded: z.boolean().optional(),
    flod_tip: z.string().optional(),
    user_id: z.number()
  }))
  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error)
    })
  }
  const uid = useNanoId()
  const memoData = {
      uid,
      ...body.data,
  }
  console.log(`创建memo`, memoData)
  const tagsCreate = [];
  // 创建memo时, 同步创建tag, 并更新关联表
  if (memoData.tags?.length) {
    for (const tag of memoData.tags) {
      tagsCreate.push({
        tag: {
          connectOrCreate: { 
            where: {
              tag_name: tag
            },
            create: {
              tag_name: tag,
              user_id: event.context.userId
            }
           },
        }
      })
    }
  }
  
  const createData: any = {
    ...memoData,
    tags: null
  };

  if (tagsCreate.length) {
    createData.tags = {
      create: tagsCreate
    }
  } else {
    // 不存在时要删除此字段, 不然会报错
    delete createData.tags;
  }
  const data = await prisma.memo.create({
    data: createData,
  })

  return {
    data,
    message: 'ok'
  }
})
