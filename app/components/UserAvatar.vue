<template>
  <Avatar shape="circle">
    <AppImg :src="userInfo?.avatar_url || '/placeholder.svg'"></AppImg>
  </Avatar>
</template>
<script lang="ts" setup>
interface User {
  id: number;
  username?: string;
  avatar_url?: string
}

defineProps<{
  userInfo?: User | null,
  previewUrl?: string | null
}>()
</script>
<style lang="less" scoped></style>