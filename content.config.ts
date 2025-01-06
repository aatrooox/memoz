import { defineCollection, z } from '@nuxt/content';

export const collections = {
  content: defineCollection({
    type: 'page',
    source: {
      include: '**/*.md',
      exclude: ['**/-*.md', 'book/**/*.md'],
      prefix: '/post',
      // cwd: process.env.CONTENT_FS_PATH,
      repository: 'https://github.com/aatrooox/Blog',
      // repository: 'https://gitea.zzao.club/zzaoclub/ob-blog',
      authToken: process.env.CONTENT_REPO_TOKEN
    },
    schema: z.object({
      date: z.date(),
      lastmod: z.date(),
      tags: z.array(z.string()),
      versions: z.array(z.string()),
    })
  })
}
