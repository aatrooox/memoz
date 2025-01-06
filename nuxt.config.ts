import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import useNanoId from './server/utils/useNanoId'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')
)
const appVersion = packageJson.version
const uuid = useNanoId(8)
const isDev = process.env.NODE_ENV === 'development'
console.log(` 当前环境为：${isDev ? '开发' : '生产'}`, )
console.log(`nuxt-secret-key已更新: `, uuid)
export default defineNuxtConfig({
  // extends: '@nuxt-themes/typography',
  future: {
    compatibilityVersion: 4,
  },
  // srcDir: '.',
  devtools: { enabled: true },
  // sourcemap: {
  //   server: true,
  //   client: true
  // },
  // build: {
  //   transpile: ['@iconify-json/icon-park-outline'],
  // },
  // robots: {
  //   useAgent: '*',
  //   allow: '*'
  // },
  // 把 icon 和客户端捆绑在一起， 减少请求服务端
  icon: {
    clientBundle: {
      scan: true,
      includeCustomCollections: true, 
      sizeLimitKb: 256,
    }
  },
  app: {
    pageTransition: false,
    layoutTransition: false,
    head: {
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-FED0EY21N0',
          async: true,
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FED0EY21N0');
          `,
          type: 'text/javascript'
        }
      ]
    }
  },
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@nuxt/image',
    '@nuxt/icon',
    // '@nuxtjs/robots',
    '@nuxtjs/mdc',
    '@nuxtjs/color-mode'
  ],
  // 解决了 mdc的一个依赖库 micromark 引入 debug 会报错的问题
  vite: {
    optimizeDeps: {
      include: ["debug"],
    },
  },
  // imports: {
  //   presets: [
  //     {
  //       from: 'animejs/lib/anime.es.js',
  //       imports: ['anime']
  //     }
  //   ]
  // },
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    // hid: 'nuxt-color-mode-script',
    // globalName: '__NUXT_COLOR_MODE__',
    // componentName: 'ColorScheme',
    // classPrefix: '',
    // classSuffix: '-mode',
    // storage: 'localStorage', // or 'sessionStorage' or 'cookie'
    // storageKey: 'nuxt-color-mode'
  },
  primevue: {
    importTheme: { from: '@@/primevue/theme.ts' },
    // usePrimeVue: false
  },
  tailwindcss: {
    cssPath: ['@/assets/css/tailwind.css', { injectPosition: "first" }],
    configPath: 'tailwind.config',
    exposeConfig: {
      level: 2
    },
    config: {},
    viewer: true,
  },
  routeRules: {
    '/': { ssr: true },
    '/article': { prerender: true, cache: { maxAge: 60 * 60 } },
    '/post/**': { cache: { maxAge: 60 * 60 } } 
  },
  css: ['primeicons/primeicons.css', '~/assets/css/main.css'],
  runtimeConfig: {
    cosSecretId: 'your_cos_secret_id',
    cosSecretKey: 'your_cos_secret_key',
    cosBucket: 'your_cos_bucket',
    cosRegion: 'your_cos_region',
    imgHost: 'https://img.zzao.club',
    jwtSecret: 'your_jwt_secret',
    nuxtSecretKey: `blog-zzao-club-${uuid}`,
    cookie: {
      domain: isDev ? 'localhost' : 'zzao.club'
    },
    public: {
      branchName: 'content@v3',
      blogVersion: appVersion,
      nuxtSecretKey:`blog-zzao-club-${uuid}`,
      imgHost: 'https://img.zzao.club',
      canRegist: false, // 是否允许注册 针对游客
      hiddenLoginEntry: false, // 是否隐藏登录入口 针对游客
      mdc: {
        headings: {
          anchorLinks: {
            h1: true,
            h2: true,
            h3: true
          },
        }
      }
    }
  },
  // 3.0.0-alpha.8 保留路径中的中文
  content: {
    build: {
      markdown: {},
      pathMeta: {
        slugifyOptions: {
          // Keep everything except invalid chars, this will preserve Chinese characters 
          remove: /[$*+~()'"!\-=#?:@]/g,
        }
      }
    }
  },
  nitro: {
    // preset: 'node-server',
    compressPublicAssets: {
      gzip: true,
      brotli: true
    },
    prerender: {
      crawlLinks: true,
      failOnError: false, // 
    },
    // 针对 server 下的 auto imports
    imports: {
      presets: [
        {
          from: 'zod',
          imports: ['z']
        },
        {
          from: 'h3-zod',
          imports: ['useSafeValidatedQuery', 'useSafeValidatedBody', 'useValidatedParams', 'zh']
        }
      ]
    },
  },
  compatibilityDate: '2024-10-29'
})