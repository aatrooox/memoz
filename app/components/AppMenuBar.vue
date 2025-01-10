<template>
  <div>
    <AppLoginDialog :login="loginBlog" ref="loginForm" @showRegisterDialog="showRegisterDialog"></AppLoginDialog>
    <AppRegisterDialog :regist="userRegist" ref="registerForm"></AppRegisterDialog>
    <AppUserSetting ref="userSetting"></AppUserSetting>
    <div class="user-info flex items-center justify-between pt-8 pb-4">
      <div class="left flex items-center">
        <UserAvatar v-if="isLogin" :user-info="user" class="hover-shadow-zinc mr-4" @click="showSetting">
        </UserAvatar>
        <Button v-else severity="secondary" label="登录" size="small" @click="showLoginForm"></Button>
        <span class="mr-2 text-xl">{{ user?.username }}</span>
      </div>
      <div class="right">
        <Button rounded severity="secondary" @click="toggleDarkMode()" size="small">
      <Icon :name="modeIcon"></Icon>
    </Button>
      </div>
    
    </div>
    
  </div>
</template>

<script setup>
const { isLogin, user, setUser } = useUser();
const loginForm = ref(null)
const registerForm = ref(null)
const userSetting = ref(null)
const toast = useToast()
const config = useRuntimeConfig()
const colorMode = useColorMode()
const route = useRoute();
const { disposeError } = useErrorDispose()
const curLabel = ref('首页')
const modes = ['light', 'dark']
const index = ref(modes.indexOf(colorMode.preference))
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

const items = ref([
{
      label: '首页',
      icon: 'icon-park-outline:home',
      route: '/'
  },
  // {
  //     label: '文章',
  //     icon: 'icon-park-outline:read-book',
  //     route: '/article',
  // },
  // {
  //     label: '动态',
  //     icon: 'icon-park-outline:message-emoji',
  //     route: '/memos'
  // },
  // {
  //     label: '小册',
  //     icon: 'icon-park-outline:book-one',
  //     route: '/category'
  // },
  {
      label: '留言板',
      icon: 'icon-park-outline:message-unread',
      route: '/message'
  },
  // {
  //     label: '设置',
  //     icon: 'icon-park-outline:setting-two',
  //     route: '/setting',
  //     hidden: !user?.value
  // },
]);

watch(() => route.path, (newVal, oldVal) => {
  switch (newVal) {
    case '/':
      curLabel.value = '首页'; break;
    case '/article':
      curLabel.value = '文章'; break;
    case '/memos':
      curLabel.value = '动态'; break;
    case '/category':
      curLabel.value = '小册'; break;
    default:
      break;
  }
})

const toggleDarkMode = () => {
  colorMode.preference = modes[(++index.value) % modes.length]
}

const loginBlog = async (body) => {
  const { data, error } = await $http.post('/api/v1/user/login', body)
  if (error?.value) {
    disposeError(error)
    return;
  }
  console.log(`data`, data)
  setUser(data.value?.data?.user)

  toast.add({
    severity: 'success',
    summary: '恭喜！登录成功!',
    detail: '',
    life: 3000
  })

}

const userRegist = async (body) => {
  const { data, error } = await $http.post('/api/v1/user/regist', body)
  if (error?.value) {
    disposeError(error)
    return;
  }

  toast.add({
    severity: 'success',
    summary: '恭喜！注册成功!',
    detail: '',
    life: 3000
  })

  await loginBlog(body)

}


const showRegisterDialog = () => {
  registerForm.value?.show()
}

const showLoginForm = () => {
  loginForm.value?.show()
}

const showSetting = () => {
  userSetting.value?.show()
}
</script>
