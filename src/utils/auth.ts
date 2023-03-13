import {sha256} from 'js-sha256'

// 权限荷载接口
interface AuthPayload {
  t: number,
  m: string
}

// 加密函数
async function digestMessage (message:string):Promise<string>{
  if(crypto && crypto.subtle ){
    // 将文本编码为字节数组
    const msgUint8 = new TextEncoder().encode(message)
    // 将消息转为哈希256位的一个ArrayBuffer
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
    // 将ArrayBuffer转为16进制字符串
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    // 将16进制字符串拼接起来
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex

  }else {
    return sha256(message).toString()
  }
}

// 生成签名
export async function generateSignature (payload:AuthPayload):Promise<string>{
  const {t:timestamp, m:lastMessage}  = payload
  const secretKey = import.meta.env.PUBLIC_SECRET_KEY as string
  const signText = `${timestamp}:${lastMessage}:${secretKey}`
  return await digestMessage(signText)
}


// 校验签名
export async function verifySignature (payload:AuthPayload, sign:string):Promise<boolean>{
  const payloadSign = await generateSignature(payload)
  return payloadSign === sign
}
