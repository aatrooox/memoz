<template>
  <div class="card-wrap border rounded-lg relative" ref="memoWrap">
    <div class="card rounded-lg transition-all duration-300 box-border p-4 pb-0">
      <!-- <AppOverflowContent :show-all="!!showAll">
        
      </AppOverflowContent> -->
      <MDC :value="parsedContent" tag="section" class="mdc-memo-prose prose" />
      <div class="memo-info flex items-center justify-between py-2">
        <span></span>
        <span>
          <span class=" text-md mr-2">{{ props.memo?.user_info?.username }}</span>
          <span class="text-zinc-400 text-xs">{{ updateDateFromNow(props.memo.create_ts) }}</span>
        </span>
      </div>
      <transition enter-active-class="transition-all transform ease-in-out duration-300 delay-900"
        enter-from-class="opacity-0 scale-90" enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all transform ease-in-out duration-300 delay-400"
        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-90">
        <div class="memo-active-info w-22 absolute -left-20 top-2 hidden sm:block" v-if="showInfo">
          <div class="" :style="{ color: textColor, fontSize: textFontSize }">{{ formatDate(props.memo.create_ts, '/', true) }}</div>
        </div>
      </transition>

    </div>
  </div>
</template>

<script lang="ts" setup>
// import anime from 'animejs/lib/anime.es.js'
const memoWrap = ref<any>(null);
const toast = useToast();
const { user } = useUser()
const { disposeError } = useErrorDispose()
const { updateDateFromNow, formatFullDate, formatDate } = useDayjs()
const emit = defineEmits(['refresh'])
const likeCount = ref(0)
const likeIcon = ref(null)
const showInfo = ref(true)
const commentReplyOpen = ref(false)
const isLikedLocal = ref(false);
const observer = ref();
const textColor = ref()
const textFontSize = ref();
const colorMode = useColorMode()
interface Props {
  memo: {
    id: number
    uid: string
    floded: boolean
    user_id: number
    content: string
    create_ts: string
    defalt_floded: boolean
    user_info?: any
    flod_tip?: string
    comments?: any[]
    likes?: any[]
    _count?: {
      comments: number
    }
  }
  showAll?: boolean
  hideBtns?: boolean
}
const refreshKey = ref(1)
const commentType = 'memo' // 评论类型
const props = defineProps<Props>()
const curCollapsed = ref(props.memo.floded)

// 解析特殊用户字符的展示, 如标签, 双链等
const parsedContent = computed(() => {
  // 把props.memo.content 中的以#开头,以空格结尾的部分提取,并替换成 链接
  return props.memo.content.replace(/#([^\s#]+)/g, (match, p1) => {
    // 以a标签外加传参的方式渲染tag
    return `[#${p1}](?tag=${p1}){target="_self"}`
    // 解析为vue组件, 避免不了换行问题, 只有换行才能触发渲染vue组件, 而如果把ProseP的p标签去掉, 还要处理需要换行的情况
    // return `::prose-a{href="?tag=${p1}"}\n#${p1}\n::`
  })
})

const copyURL2Clipboard = async () => {
  await navigator.clipboard.writeText(`https://blog.zzao.club/m/${props.memo.uid}`);
  toast.add({ severity: 'contrast', summary: '链接已复制！', detail: '快去粘贴分享吧！', life: 3000 });
}

const copyIMG2Clipboard = async () => {
  await navigator.clipboard.writeText(`https://blog.zzao.club/m/${props.memo.uid}`);
  toast.add({ severity: 'contrast', summary: '图片已复制!(假的，还没写呢)', detail: '快去粘贴分享吧！', life: 3000 });
}

const memoReply = () => {
  if (!user.value?.id) {
    toast.add({ severity: 'error', summary: '登录后就可以评论了', life: 3000 });
    return
  }
  commentReplyOpen.value = !commentReplyOpen.value
}
// 评论
const createComment = async (message: string) => {
  if (!user.value?.id) {
    toast.add({ severity: 'error', summary: '请先登录后再留言', life: 3000 });
    return
  }

  const { data, error } = await $http.post('/api/v1/comment/create', { type: commentType, user_id: user.value?.id, memo_id: props.memo.id, content: message }, { server: false })
  if (error.value) {
    disposeError(error)
    return;
  }

  toast.add({ severity: 'contrast', summary: '评论成功', life: 3000 })
  commentReplyOpen.value = false;
  refreshList()
  // emit('refresh')
  // refresh()
}
const isLiked = computed(() => !!props.memo.likes?.find((item) => item.user_id === user?.value?.id))
// 先乐观更新页面，再请求接口
const likeMemo = async () => {
  // console.log(`isLiked`, isLiked.value, isLikedLocal.value)
  return;
  if (isLiked.value) isLikedLocal.value = true;
  // const { data: count } = await $http.get('/api/v1/like/count', { memo_ids: `${props.memo.id}` })

  if (!isLikedLocal.value) {
    // 动画
    // anime({
    //   targets: (likeIcon.value as any)?.$el,
    //   translateY: [0, -10, 0],
    //   color: 'red',
    //   scale: [1, 1.4, 1],
    //   duration: 200,
    //   easing: 'easeInOutQuad',
    //   update: function (anim) {
    //     // console.log('progress : ' + Math.round(anim.progress) + '%');
    //   },
    //   change: function () {
    //   }
    // })
    // const { data, error } = await $http.post('/api/v1/like/add', { target: 'memo', user_id: user?.value?.id, memo_id: props.memo.id }, { server: false })

    // if (error.value) {
    //   disposeError(error)
    //   return;
    // }
    likeCount.value = (props.memo?.likes?.length || 0) as number + 1

    isLikedLocal.value = true;
    // console.log(`点赞 =》`, data.value)

  } else {
    // const id = props.memo.likes?.find((item) => item.user_id === user?.value?.id)?.id
    // const { data, error } = await $http.post('/api/v1/like/cancel', { id }, { server: false })
    likeCount.value = likeCount.value - 1
    isLikedLocal.value = false;
  }


  // refreshList();
}

const refreshList = () => {
  refreshKey.value++
  emit('refresh')
}

const updateTextColor = () => {
  const rect = memoWrap.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  
  // 计算组件中心相对于文档顶部的距离
  const componentCenter = rect.top + rect.height / 2 + window.scrollY;

  // 计算视口中心相对于文档顶部的距离
  const viewportCenter = window.scrollY + viewportHeight / 2;

  // 计算组件中心与视口中心的距离
  const distanceFromCenter = Math.abs(componentCenter - viewportCenter);
  // 根据距离调整透明度
  const opacity = 1 - Math.min(distanceFromCenter / (viewportHeight / 2), 1);
  const isDark = colorMode.preference === 'dark';
  textColor.value = isDark ? `rgba(255, 255, 255, ${0.5 + opacity * 0.5})` : `rgba(0, 0, 0, ${0.5 + opacity * 0.5})`; // 颜色从浅到深
  // 根据距离调整字号
  const minFontSize = 10; // 最小字号
  const maxFontSize = 18; // 最大字号
  const fontSize = minFontSize + (maxFontSize - minFontSize) * opacity; // 动态计算字号
  textFontSize.value = `${fontSize}px`;
};

onMounted(() => {
  isLikedLocal.value = false;
  const callback = (entries: any) => {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) {
        console.log("Div 进入视口");
        // entry.target.style.backgroundColor = "green";
        showInfo.value = true;
        updateTextColor();
        window.addEventListener("scroll", updateTextColor);
      } else {
        console.log("Div 离开视口");
        showInfo.value = false;
        window.removeEventListener("scroll", updateTextColor);
        // entry.target.style.backgroundColor = "red";
      }
    });
  };

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };

  observer.value = new IntersectionObserver(callback, options);
  observer.value.observe(memoWrap.value); // 开始观察
})

onUnmounted(() => {
  observer.value?.disconnect();
  window.removeEventListener("scroll", updateTextColor);
})
</script>
