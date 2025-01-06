<template>
  <NuxtLoadingIndicator color="black" />
  <NuxtLayout class="bg-grid-dashed">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const { setUser } = useUser();

onMounted(() => {
  const userData = localStorage.getItem('blog_user')
  if (userData) setUser(JSON.parse(userData));
})
</script>
