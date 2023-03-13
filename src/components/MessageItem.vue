<template>


  <div class="py-2 -mx-4 px-4 transition-colors md:hover:bg-slate/3">
      <div class="flex gap-3 rounded-lg" :class="{'op-75':role === 'user'}" >
        <div class="shrink-0 w-7 h-7 mt-4 rounded-full op-80" :class="roleClass[role]"></div>
        <div @click="test" class="message prose break-words overflow-hidden" v-html="htmlString(message)" ></div>
        </div>
      </div>

        <div class="flex items-center justify-end px-3 mb-2">
          <div class="flex items-center gap-1 px-2 py-0.5 op-70 border border-slate rounded-md text-sm cursor-pointer hover:bg-slate/10">

            <span>Regenerate </span>
          </div>
        </div>
  </template>
  
  <script lang='ts' setup>
  import type { ChatMessage } from '@/types'
  import MarkdownIt from 'markdown-it'
  // @ts-ignore
  import mdKatex from 'markdown-it-katex'
  import mdHighlight from 'markdown-it-highlightjs'
  import { useClipboard } from '@vueuse/core'

  interface Props {
    message?: string | Function,
    role: ChatMessage['role']
  }
  withDefaults(defineProps<Props>(),{
    message: '```js\nconsole.log("hello world")\n```'
  })
  

  const roleClass = {
    system: 'bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300',
    user: 'bg-gradient-to-r from-purple-400 to-yellow-400',
    assistant: 'bg-gradient-to-r from-yellow-200 via-green-200 to-green-300',
  }
  
  const { copy, copied } = useClipboard()
 const test = (e:MouseEvent)=>{
  let el = e.target as HTMLElement
  let code = null

  if(el.id === 'copy-btn' ){
    code = decodeURIComponent(el.dataset.code!)
    copy(code)
  }else if(el.id === 'copy-svg'){
    code = decodeURIComponent(el.parentElement?.dataset.code!)
    copy(code)
  }


  
 }


  const htmlString = (message:string|Function)=>{

  const md = MarkdownIt({html: true}).use(mdKatex).use(mdHighlight)
  const fence = md.renderer.rules.fence!
  md.renderer.rules.fence =  (...args)=>{
    const [tokens,idx] = args
    const token = tokens[idx]
  
    const rawCode = fence(...args)

    return `<div class='relative'>
      <div data-code=${encodeURIComponent(token.content)} id='copy-btn' class="absolute top-12px right-12px z-3 flex justify-center items-center border b-transparent w-8 h-8 p-2 bg-dark-300 op-90 transition-all group cursor-pointer">
          <svg id='copy-svg' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M28 10v18H10V10h18m0-2H10a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Z" /><path fill="currentColor" d="M4 18H2V4a2 2 0 0 1 2-2h14v2H4Z" /></svg>
            <div class="opacity-0 h-7 px-2.5 py-1 box-border text-xs c-white inline-flex justify-center items-center  rounded absolute z-1 transition duration-600 whitespace-nowrap -top-8" group-hover:opacity-100>
              ${copied.value ? 'Copied' : 'Copy'}
            </div>
      </div>
      ${rawCode}
      </div>`
    
  }
  if(typeof message === 'string'){
    return md.render(message)
  }
  return ''
  }

  </script>
  
  <style lang='stylus' scoped>
  
  </style>