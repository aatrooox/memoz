import prisma from "@@/server/prisma"

export default defineEventHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    tag_name: z.string()
  }))
  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error)
    })
  }
  
  const tagNames = body.data.tag_name.split(',').map( name => ({ tag_name: name, user_id: event.context.userId }) )

  for (let tag of tagNames) {
    await prisma.tag.upsert({
        where: {
          tag_name: tag.tag_name
        },
        update: {
          tag_name: tag.tag_name
        },
        create: {
          tag_name: tag.tag_name,
          user_id: tag.user_id
        }
      })
  }

  return {
    data: 'ok',
    message: 'ok'
  }
})
