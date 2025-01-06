<template>
  <!-- <AppBg></AppBg> -->
  <div class="h-full max-w-7xl px-4 box-border lg:w-6xl md:w-3xl m-auto bg-grid-dashed">
    <Toast />
    <Toast group="http" position="top-center" />
    <ScrollTop />
    <div class="m-auto flex gap-5 box-border">
      <div class="sticky top-0 h-screen overflow-y-auto hidden md:block md:w-[20%] lg:w-[20%]">
          <AppMenu></AppMenu>
      </div>
      <div class="w-[100%] md:w-[60%] lg:w-[60%]">
        <AppMenuBar></AppMenuBar>
        <div class="px-4 pb-10 m-auto mb-4 sm:px-8 sm:rounded-lg">
          <main class="max-w-none relative">
            <slot />
          </main>
        </div>
      </div>
      <div class="sticky top-0 h-screen overflow-y-auto hidden md:block md:w-[20%] lg:w-[20%]">
        <AppMsgFlow></AppMsgFlow>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
// const handlePageScroll = (e) => {
//   console.log(`e.target`, e.target.scrollTop)
// }

</script>