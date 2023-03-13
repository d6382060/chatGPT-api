<template>
<MessageItem v-for="item in MessageList" :role="item.role" :message="item.content"/>

<div>
<textarea ref="textInputRef" @keydown.enter="sendMessage" v-model.trim="textValue" placeholder="问题"  cols="30" rows="10"></textarea>
 <button  @click="sendMessage">send</button>
</div>

</template>

<script lang='ts' setup>
import { generatePayload, parseOpenAIStream } from '@/utils/openAI'
import { verifySignature } from '@/utils/auth'


import { reactive, ref } from 'vue';
import { generateSignature } from '@/utils/auth'
import MessageItem from './MessageItem.vue';


const aaa = ()=>{
  console.log('aaa');
  
}

// openAI的key
const apiKey = import.meta.env.VITE_OPENAI_API_KEY

// 代理地址
const httpsProxy = import.meta.env.HTTPS_PROXY
// base url
const baseUrl = (import.meta.env.OPENAI_API_BASE_URL || 'https://api.openai.com').trim().replace(/\/$/,'')

// 导出一个post请求
const post = async (context:any)=>{
  
  const body = JSON.parse(context.body)// 获取请求体

   
  const { sign, time, messages } = body // 获取请求体中的sign,time,messages

  
  if (!messages) {
    return new Response('No input text')
  } // 如果没有输入文本，返回一个响应
  if (import.meta.env.PROD && !await verifySignature({ t: time, m: messages?.[messages.length - 1]?.content || '', }, sign)) {
    return new Response('Invalid signature')
  } // 如果是生产环境，验证签名

  const initOptions = generatePayload(apiKey, messages) // 请求参数

  
  // #vercel-disable-blocks
  if (httpsProxy) {
    // @ts-ignore
    initOptions['dispatcher'] = new ProxyAgent(httpsProxy)
  }
  // #vercel-end

  // @ts-ignore
  const response = await fetch(`${baseUrl}/v1/chat/completions`, initOptions) as Response
 console.log(response,'response');
 let reader = response.body?.getReader()

  
  return new Response(parseOpenAIStream(reader))
}


const textValue = ref<string>('')


const MessageList =<any>ref([])

let textInputRef = ref<HTMLInputElement>()
  
const sendMessage = ()=>{
  if(!textValue.value) return
  let message  = textValue.value
  console.log(message);
   // @ts-ignore
   if (window?.umami) umami.trackEvent('chat_generate')
  textValue.value = ''
  MessageList.value = [
    ...MessageList.value, 
    {
    role:'user',
    content:message
    }
]

console.log(MessageList.value);
requestWithLatestMessage()
  
}

let getController = ref<AbortController>()


const requestWithLatestMessage =async ()=>{
 

 try {

   // 创建一个取消请求的控制器
   const controller = new AbortController();
  getController.value = controller
  const requestMessageList = [...MessageList.value]

  // 当前时间戳
  const timestamp = Date.now();

  // 发起fetch请求
  const response =await post({
    method: 'POST',
    body: JSON.stringify({
      messages: requestMessageList,
      time:timestamp,
      sign:await generateSignature({
            t: timestamp,
            m: requestMessageList?.[requestMessageList.length - 1]?.content || '',
          }),
    }),
    signal: controller.signal,
  })
  
  if (!response.ok) {
        throw new Error(response.statusText)
      } // 如果请求成功，返回响应的json数据
      const data = response.body
       console.log(data,'data');
       
      if (!data) {
        throw new Error('No data')
      } 
      const reader = data.getReader()

 

      const decoder = new TextDecoder() // 读取数据


       
      let done = false
      let currentAssistantMessage = reactive<any>({
      role:'assistant',
        content:''
      })

      MessageList.value = [
        ...MessageList.value, 
        currentAssistantMessage
    ]
    textInputRef.value?.blur()
      while(!done){
        const {value, done: readerDone} = await reader.read()
        if(value){
          let char = decoder.decode(value)

          if (char === '\n') {
            continue
          }
          if(char){
            currentAssistantMessage.content+=char
          }
      
        }
        done = readerDone
      }

      
  
 } catch (error) {
  
 }
 
}

</script>

<style lang='stylus' scoped>

</style>