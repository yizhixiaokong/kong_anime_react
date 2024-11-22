import axios, { type AxiosRequestConfig } from 'axios'
import { message } from 'antd'

const BASE_URL = "http://localhost:8080/api/v1";

const service = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      service.request<any, T>(config).then((res: any) => {
        if (res.status !== 200) {
          message.error(res.message)
          return reject(res)
        }
  
        resolve({...res.data,status:res.status})
      }).catch((err) => {
        message.error(err.response.data.error)
        return reject(err)
      })
    })
  }
export function get<T = any>(url: string, data?: AxiosRequestConfig): Promise<T> {
    return request<T>({ data, method: 'GET', url })
  }
  
  export function post<T = any>(url: string, data?:AxiosRequestConfig): Promise<T> {
    return request<T>({data, method: 'POST', url })
  }
  
  export function put<T = any>(url: string, data?: AxiosRequestConfig): Promise<T> {
    return request<T>({data, method: 'PUT', url })
  }
  
  export function del<T = any>(url: string, data?: AxiosRequestConfig): Promise<T> {
    return request<T>({data, method: 'Delete', url })
  }
  
export default service;