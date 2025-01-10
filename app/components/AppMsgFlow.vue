<template>
  <div class="flex flex-col box-border">
    <!-- 热力图 -->
    <div class="hot-view flex flex-wrap gap-1 transition-all duration-300 rounded-tl-md rounded-tr-md rounded-br-md relative">
      <div class="w-4 h-4 bg-zinc-300" v-for="item in datas" :style="{}"></div>

      <!-- <div class="stats-count absolute left-[-1px] bottom-[-24px] h-6 leading-6 px-2 text-xs border border-t-white rounded-bl-md rounded-br-md shadow-none" v-tooltip="`已累计记录888天`">888</div> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
// 没有记录默认为灰色. 十个灰色方块
// 累计记录少于30天, 显示为蓝色方块, 不同深浅的蓝色表示当天记录的数量
// 当天少于 3条 记录为浅蓝
// 当天少于 5条 记录为中蓝
// 当天少于 10条 记录为深蓝
// 累计记录>30 <100, 显示为紫色.  方块改为紫色基调
// 累计记录>365 显示为金色 方块改为金色基调
// 默认只展示最近30有效天的记录
// TODO 再加一个UI效果,用于展示两次记录的天数间隔大小
// 由一个状态过度到下一个状态时, 要有一个时隐时现的色彩效果,表示在记录xx天,就达到了记录xx天的新纪录
// 记录后的音效: 炉石加buff时的打铁声


const modeIcon = computed(() => {
  switch (colorMode.preference) {
    case 'system':
      return 'icon-park-outline:computer'
    case 'light':
      return 'icon-park-outline:sun-one'
    case 'dark':
      return 'icon-park-outline:moon'
    default:
      return 'icon-park-outline:computer'
  }
})

const datas = ref([
  {
    date: '2024/01/02',
    count: 2,
  },
  {
    date: '2024/01/02',
    count: 2,
  },
  {
    date: '2024/01/02',
    count: 2,
  },
  {
    date: '2024/01/02',
    count: 2,
  },
  {
    date: '2024/01/02',
    count: 2,
  },
  {
    date: '2024/01/02',
    count: 2,
  },
  {
    date: '2024/01/02',
    count: 2,
  },
  {
    date: '2024/01/02',
    count: 2,
  },
  {
    date: '2024/01/02',
    count: 2,
  },
  {
    date: '2024/01/02',
    count: 2,
  },
  {
    date: '2024/01/02',
    count: 2,
  },
  {
    date: '2024/01/02',
    count: 2,
  },
  {
    date: '2024/01/02',
    count: 2,
  },
  {
    date: '2024/01/02',
    count: 2,
  },
  {
    date: '2024/01/02',
    count: 2,
  },
  {
    date: '2024/01/02',
    count: 2,
  },
])


</script>
<style lang="less" scoped></style>