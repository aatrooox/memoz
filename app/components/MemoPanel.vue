<template>
  <div class="card-wrap border rounded-lg">
    <div class="card rounded-lg transition-all duration-300 box-border p-4 pb-0">
      <AppOverflowContent :show-all="!!showAll">
        <MDC :value="props.memo.content" tag="section" class="mdc-memo-prose prose" />
      </AppOverflowContent>
      <div class="memo-info flex items-center justify-between py-2">
        <span></span>
        <span>
          <span class="font-bold text-md mr-2">{{ props.memo?.user_info?.username }}</span> 
          <span class="text-zinc-400 text-xs">{{ updateDateFromNow(props.memo.create_ts) }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import anime from 'animejs/lib/anime.es.js'
const menu = ref<any>(null);
const toast = useToast();
const { user } = useUser()
const { disposeError } = useErrorDispose()
const { updateDateFromNow, formatFullDate } = useDayjs()
const emit = defineEmits(['refresh'])
const likeCount = ref(0)
const likeIcon = ref(null)
const commentReplyOpen = ref(false)
const isLikedLocal = ref(false);

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

// const { data: msgList, error, refresh, status } = await $http.get('/api/v1/comment/list', { type: commentType, memo_id: props.memo.id }, { key: 'memo-comment-list', server: false, watch: [refreshKey] })

// console.log(`msgList`, msgList.value?.data)
// if (error.value) {
//   disposeError(error.value)
// }

onMounted(() => {
  isLikedLocal.value = false;
})
</script>
