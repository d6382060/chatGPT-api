import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser'
import type { ChatMessage } from '@/types'


// 生成荷载
export const generatePayload = (apiKey: string,messages:ChatMessage[]): RequestInit => {
 return {
  headers:{
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  },
  method: 'POST',
  body: JSON.stringify({
    model:'gpt-3.5-turbo',
    messages,
    temperature: 0.6,
    stream: true
  })
 }
}

// 解析OpenAI的Stream响应
export const parseOpenAIStream = (reader:ReadableStreamDefaultReader<Uint8Array> | undefined) => {
  // 编码字符串为字节数组
  const encoder = new TextEncoder()
  // 解码字节数组为字符串
  const decoder = new TextDecoder()
  // 创建一个ReadableStream对象
  const stream = new ReadableStream({
    // 启动流的方法
   async start(controller) {
       reader?.read().then(function processText({ done, value }):any {
        if (done) {
          return
        }
        const streamParser = (e:ParsedEvent | ReconnectInterval) =>{
          if(e.type === 'event'){
            const data = e.data
            if (data === '[DONE]') {
              controller.close()
              return
            }
            console.log(data,'data');
            
            try {
              // response = {
              //   id: 'chatcmpl-6pULPSegWhFgi0XQ1DtgA3zTa1WR6',
              //   object: 'chat.completion.chunk',
              //   created: 1677729391,
              //   model: 'gpt-3.5-turbo-0301',
              //   choices: [
              //     { delta: { content: '你' }, index: 0, finish_reason: null }
              //   ],
              // }

              
              const json = JSON.parse(data)
              const text = json.choices[0].delta?.content || ''
              const queue = encoder.encode(text)
              
              controller.enqueue(queue)
            } catch (e) {
              controller.error(e)
            }
          }
  
        }
        const parser = createParser(streamParser)
        parser.feed(decoder.decode(value))
        return reader?.read().then(processText)
      })
  
    }
  })

  return stream
}