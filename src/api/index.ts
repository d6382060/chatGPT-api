

let baseUrl = import.meta.env.VITE_APP_BASE_API

// 添加查询参数
const addQueryParams = (url:string,params:any) => {
  const urlObject = new URL(url)
  const searchParams = new URLSearchParams(urlObject.search)
     // 批量
     Object.entries(params).forEach(([k, v]) => {
      searchParams.set(k, v as string)
    })
    urlObject.search = searchParams.toString()
  return urlObject.toString()
}
export const api = async (apiUrl:string,method='POST',params?:any,)=>{

 
  let requestUrl = baseUrl + apiUrl
  let option = {
    headers:{
      'Content-Type':'application/json'
    },
    method
  }
  if(method === 'POST'){
    // @ts-ignore
    option['body'] = JSON.stringify(params)
  }else{
    requestUrl = addQueryParams(requestUrl,params)

  }

  
  
  let res = await fetch(requestUrl,option)
  let data = await res.json()
  return data
}