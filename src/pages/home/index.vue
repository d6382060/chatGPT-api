<template>
<div class="h-30 bg-red px-20 flex items-center">
  <div>
    首页
  </div>

    <!-- 头像 -->
    <div v-if="!!getUserInfo" @mouseover="showInfoList = true" @mouseout="showInfoList = false"  class="w-100 absolute top-2 right-0  flex flex-col items-center">
      <div class="rounded-50% bg-black w-25 h-25 ">1</div>
    
      <!-- 下拉框 -->
      <div v-show="showInfoList" class="drop-down">
        <div>{{ getUserInfo?.account }}</div>
        <div @click="outLogin">退出登录</div>
      </div>
    </div>
    <!-- <div v-else @click="login">登录</div> -->
</div>

<SendMessage @sendMessage="pushMessage"/>



<div @click="createChat">创建聊天</div>

<div @click="getMessage(item.message_id)" v-for="item in messageList" :key="item.message_id">
 {{ item.title }}
</div>


</template>

<script lang='ts' setup>
import SendMessage from '@/components/SendMessage.vue';
import { useRouter } from 'vue-router';
const router = useRouter();


let title = ref('new chat')
const createChat = async ()=>{
 let res = await api('create_chat','POST',{title:title.value})
 getChatList()
 console.log(res,'res');
}

// 获取用户信息
const getUserInfo = computed(()=>{
  let data = localStorage.getItem('userData') || ''
  return JSON.parse(data)
})


interface MessageItem{
  message_id:number
  title:string
  userId:number
}


let messageList = ref<MessageItem []>([])
// 获取聊天列表
const getChatList =async ()=>{
  let res = await api('get_chat_list','GET',{})
  if(res.code === 10000) {
    messageList.value = res.data
  }
 console.log(res,'res');
}




let messageId = ref(0)
const getMessage = async (id:number)=>{
  messageId.value = id
  // router.push(`/message/${id}`)
  let res = await api('get_message','GET',{message_id:id})
  console.log(res.data[0]?.message,'data');
  
  let a = JSON.parse(res.data[0]?.message || '')
  console.log(a,'aaa');
  
}

const login = () => {
  console.log('登录')
  router.push('/login')
}

// let userInfo = ref(null)
// let token = localStorage.getItem('token')
// const user =async ()=>{
//   let res = await api('protected','GET',{token})
//   if(res.code === 10002){
//     router.push('/login')
//     return
//   }
//   userInfo.value = res.data
  
// }


const outLogin = ()=>{
  localStorage.clear()
  router.push('/login')
}

// 下拉列表
const showInfoList = ref(false)



let testMessage = ref('')
// 保存消息
const pushMessage =async (message:any)=>{
  let res = await api('save_message_list','POST',{messageId:messageId.value,message:JSON.stringify(message)})
}

onMounted(()=>{
  getChatList()
})

</script>

<style scoped>
.drop-down{
   @apply relative bg-#a9e34b  top-3 mx-20 w-100 text-center
}

.drop-down > div:hover{
  @apply bg-#ecb0c1/50
}
.drop-down > div{
  @apply cursor-pointer h-30 leading-30
}
</style>