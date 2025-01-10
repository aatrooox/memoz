<template>
  <!-- <AppBg></AppBg> -->
  <div class="h-full max-w-7xl px-4 box-border lg:w-6xl md:w-3xl m-auto bg-grid-dashed">
    <Toast />
    <Toast group="http" position="top-center" />
    <ScrollTop />
    <div class="m-auto flex-col justify-end md:flex md:flex-row gap-5 box-border">
      <!-- <div class="sticky top-0 h-screen overflow-y-auto hidden md:block md:w-[20%] lg:w-[20%]">
          <AppMenu></AppMenu>
      </div> -->
      <div class="md:sticky md:top-0 block px-4 w-[100%] sm:px-8 md:w-[30%] md:h-screen lg:w-[20%]">
        <AppMenuBar></AppMenuBar>
        <AppMsgFlow></AppMsgFlow>
      </div>
      <div class="w-[100%] md:w-[70%] md:max-w-[600px] lg:w-[60%] pt-8">
        <!-- <AppMenuBar></AppMenuBar> -->
        <div class="px-4 pb-10 m-auto mb-4 sm:px-8 sm:rounded-lg">
          <main class="max-w-none relative">
            <slot />
          </main>
        </div>
      </div>
      
    </div>
  </div>

</template>

<script lang="ts" setup>
// const handlePageScroll = (e) => {
//   console.log(`e.target`, e.target.scrollTop)
// }

</script>