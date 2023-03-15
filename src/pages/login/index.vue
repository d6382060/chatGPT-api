<template>
 
<div>
  <Layout>
  <div class="m-a mt-50 rounded-20 bg-#fff w-300 h-350 p-20 flex flex-col">
    <div class="text-center">{{isRegister ? '注册':'登录'}}</div>
    <div class="flex flex-col items-center flex-1 justify-center">
      <div>
      <div>账号</div>
      <input v-model="loginPrams.account" type="text">
    </div>
    <div>
      <div>密码</div>
      <input v-model="loginPrams.password" type="password">
      </div>
    </div>
    <div class="text-red h-20">{{ errMessage || '' }}</div>
   <div>
     <button v-if="!isRegister" @click="login" class="bg-black mt-20 text-#fff w-full h-40 rounded-5">登录</button>
     <button @click="register" class="bg-black mt-20 text-#fff w-full h-40 rounded-5">注册</button>
   </div>
  </div>
  </Layout>
</div>

</template>

<script lang='ts' setup>
import Layout from '@/components/Layout.vue';

const router = useRouter();
const loginPrams = reactive({
  account: '',
  password: ''
})

let errMessage = ref('')
const login =  async ()=>{
  let res = await api('login','POST',loginPrams)
  errMessage.value = res?.message ?? ''
  localStorage.setItem('userData',JSON.stringify(res?.data) ?? null)
  localStorage.setItem('token',res?.data?.token ?? '')
  if(res.code === 10000){
    router.push('/home')
  }
}




let isRegister = ref(false)
const register =async ()=>{
  if(isRegister.value){
  let res = await api('register','POST',loginPrams)
  errMessage.value = res?.message ?? ''
  console.log(res,'res');
  if(res.code === 10000){
    isRegister.value = false
  }
  }else {
    isRegister.value = true
  }
}

</script>

<style lang='stylus' scoped>

</style>