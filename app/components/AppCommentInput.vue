<template>
  <FloatLabel variant="on">
    <Textarea class="w-full" id="over_label" autoResize v-model="comment" :rows="rows"
      @value-change="emit('value-change', comment)" maxlength="256" ref="commentInputRef"/>
    <label for="on_label">{{ label }}</label>
  </FloatLabel>
  <!-- 标签选择器 -->
  <Listbox v-if="showTagList" :options="tags" optionLabel="tag_name" @change="chooseTag" class="w-30" />
  <div class="btns flex justify-between items-center">
    <div class="left flex items-center gap-2">
      <Button rounded text @click="toggle">
        <Icon name="icon-park-outline:face-with-smiling-open-eyes"></Icon>
      </Button>
      <span class="text-xs text-zinc-400">最多256字符</span>

      <span class="text-xs text-zinc-400">
        所有人可以回复
      </span>

      <Popover ref="emojiPopover">
        <EmojiPicker :native="true" :display-recent="true" :hide-search="true" :hide-group-icons="true"
          :theme="emojiTheme" @select="onSelectEmoji" ref="EmojiPickerRef"></EmojiPicker>
      </Popover>
    </div>
    <div class="right">
      <Button size="small" text @click="cancelSend">
        <Icon name="icon-park-outline:close-one"></Icon><span>取消</span>
      </Button>
      <Button size="small" text @click="sendComment">
        <Icon name="icon-park-outline:send"></Icon><span>发送</span>
      </Button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

const emit = defineEmits(['value-change', 'send', 'cancel'])
const { user } = useUser()
const emojiPopover = ref(null)
const color = useColorMode()
const EmojiPickerRef = ref()
const commentInputRef = ref()
const comment = ref<string>('')

// 是否显示标签列表
const showTagList = ref(false);
// 当前输入的标签在输入内容的位置
const searchTagIndex = ref<number[]>([]);
//
const inputTag = ref<string>('')
// type 在哪里评论， target 评论的对象
const { type = 'memo', target = '' } = defineProps<{ type?: string, target?: string }>()
const selectedCity = ref();
const tags = ref();
const emojiTheme = computed(() => {
  switch (color.preference) {
    case 'dark':
      return 'dark';
    case 'light':
      return 'light';
    case 'system':
      return 'auto';
  }
})
const label = computed(() => {
  // 发表评论时，显示 在发表 xxx
  // 回复某条评论时，显示回复 xxx
  if (target) return subCommentLabel.value

  const name = user.value?.username || '游客'
  switch (type) {
    case 'memo':
      return `memo by ${name}`
    case 'blog':
      return `留言 by ${name}`
    case 'comment':
      return `评论 by ${name}`
    case 'reply':
      return `回复 by ${name}`
    default:
      return `memo by ${name}`
  }
})

const initTagList = async(tag: string) => {
  const { data } = await $http.get<any[]>('/api/v1/tag/list', { tag }, { key: 'tags - ' + inputTag.value , server: false })
  tags.value = data.value.data;
}

const rows = ref<number>(3)
const cols = ref<number>(30)

// 从textarea中提取标签
const extractTags = (content: string) => {
  const tagRegex = /#([^\s#]+)/g;
  const tags = new Set(); // 使用 Set 去重
  let match;

  while ((match = tagRegex.exec(content)) !== null) {
    tags.add(match[1]);
  }

  return Array.from(tags); // 将 Set 转换为数组
}

// 移除 textarea 中的标签
const removeTagsFromTextarea = (content: string) => {
  return content.replace(/#([^\s#]+)/g, '').trim();
}

/**
 * 选择并插入标签到评论中
 * 
 * @param {any} tag - 用户选择的标签对象，包含标签名称等信息
 */
const chooseTag = (tag: any) => {
  // 获取标签名称，并在末尾添加一个空格
  const tagName = tag.value.tag_name + ' ';
  // 解构获取标签插入位置的起始和结束索引
  const [start, end] = searchTagIndex.value;
  // 在指定位置插入标签名称
  comment.value = comment.value.substring(0, start) + tagName + comment.value.substring(end as number);
  // 计算新的光标位置
  const newCursorIndex = (start as number) + tagName.length;

  // 在 Vue 实例的下一个生命周期调用，确保 DOM 已经更新
  nextTick(() => {
    // 隐藏标签列表
    showTagList.value = false;
    // 清空当前选中的标签索引
    searchTagIndex.value = [];
    // 聚焦到评论输入框
    commentInputRef.value.$el.focus();
    // 设置光标位置到新插入标签的末尾
    commentInputRef.value.$el.setSelectionRange(newCursorIndex, newCursorIndex);
  })
}

// 动态展示标签列表
watch( comment, () => {
  // 此时光标在哪里输入
  const cursorIndex = commentInputRef.value.$el.selectionStart
  // 此时输入的值是否是#
  const isInputTag = comment.value[cursorIndex -1 ] === '#';
  const isSpace = comment.value[cursorIndex - 1] === ' ';
  if (showTagList.value && isSpace) {
    showTagList.value = false;
    return;
  }
  // 如果是#则触发标签的列表查询, 后续的输入都视为标签内容, 直到出现空格为止
   if(isInputTag) {
    showTagList.value = true;
    searchTagIndex.value[0] = cursorIndex
   }
   // 如果此时正在输入标签
   if (showTagList.value) {
    // 更新索引的截止位置
    searchTagIndex.value[1] = cursorIndex;
    // 如果输入时, 正在删除, 则不再查询
    if (typeof searchTagIndex.value[1] === 'number' && typeof searchTagIndex.value[0] === 'number' && searchTagIndex.value[1] < searchTagIndex.value[0]) {
     showTagList.value = false;
     return;
    }
    inputTag.value = comment.value.substring(searchTagIndex.value[0] as number, searchTagIndex.value[1] as number);
    initTagList(inputTag.value)
   }
})

const subCommentLabel = computed(() => {
  return `回复@${target || user.value?.username}`
})

const toggle = (event: any) => {
  (emojiPopover.value as any)?.toggle(event);
}

const onSelectEmoji = (emoji: any) => {
  console.log(`emoji`, emoji)
  comment.value += emoji.i
}

const clear = () => {
  comment.value = ''
}

const sendComment = () => {
  const tags = extractTags(comment.value);
  // comment.value = removeTagsFromTextarea(comment.value);
  emit('send', { content: comment.value, tags})
  clear()
}

const cancelSend = () => {
  clear()
  emit('cancel')
}
defineExpose({ clear })
</script>
<style lang="less" scoped></style>
