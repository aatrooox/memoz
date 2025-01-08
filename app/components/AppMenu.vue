<template>
  <div class="w-full h-full box-border pt-8 px-4">
    <div class="header w-40 flex gap-2 items-center mb-4">
      <UserAvatar size="small" @click="showSetting">
      </UserAvatar>
      <div class="site-name text-xl font-bold">Memoz</div>
    </div>

    <div class="data-panel flex gap-1 ">
      <div class="flex items-center flex-col"><span class="text-primary px-1 text-xl font-bold text-zinc-400">{{  runningDate }}</span> <Icon name="icon-park-outline:calendar"></Icon></div>
      <div class="flex items-center flex-col"><span class="text-primary px-1 text-xl font-bold text-zinc-400">{{  memoCount }}</span> <Icon name="icon-park-outline:twitter" class="stroke-blue"></Icon> </div>
    </div>
   
  </div>
</template>

<script setup>
const toast = useToast()
const runningDate = ref(888)
const memoCount = ref(999)
const { disposeError } = useErrorDispose()
const { isLogin, user, setUser } = useUser();


</script>
