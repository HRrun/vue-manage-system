// 引入 axios 
import axios from 'axios'
// 引入qs模块，用来系列化post类型的数据
import QS from 'qs'
// 引入element-ui的Message模块，用于信息提示
import { Message } from 'element-ui'

// create an axios instance 创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_API, // api的请求地址
    timeout: 50000, // request timeout
    responseType: "json",
    withCredentials: true, //是否允许带cookie
    headers: {
        // 设置请求头
        "Content-Type": "application/json;charset=utf-8"
    }
})

service.interceptors.request.use(
    config => {
        // 在发送请求之前做什么
        if (config.method === "post") {
            // 系列化
            config.data = QS.stringify(config.data);
            config.data = JSON.stringify(config.data);
            // 根据实际情况确定是否需要系列化
        } else {
        }
        return config;
    },
    error => {
        // 错误处理
        Message({
            showClose: true,
            message: error,
            type: "warning"
        });
        return Promise.reject(error);
    }
)

service.interceptors.response.use(
    response => {
        // 请求状态码
        if (response.status === 200) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(response)
        }
    },
    // 服务器状态码不是2开头的的情况
    // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    // 可根据实际情况要求做增加
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                // 401: 未登录
                // 未登录则跳转登录页面，并携带当前页面的路径
                // 在登录成功后返回当前页面，这一步需要在登录页操作。
                case 401:
                    router.replace({
                        path: '/login',
                        query: {
                            redirect: router.currentRoute.fullPath
                        }
                    });
                    break;
                // 403 token过期
                // 登录过期对用户进行提示
                // 清除本地token和清空vuex中token对象
                // 跳转登录页面
                case 403:
                    Message({
                        message: '登录过期，请重新登录',
                        duration: 1000,
                        forbidClick: true
                    });
                    // 清除token
                    localStorage.removeItem('token');
                    // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
                    setTimeout(() => {
                        router.replace({
                            path: '/login',
                            query: {
                                redirect: router.currentRoute.fullPath
                            }
                        });
                    }, 1000);
                    break;
                // 404请求不存在
                case 404:
                    Message({
                        message: '网络请求不存在',
                        duration: 1500,
                        forbidClick: true
                    });
                    break;
                default:
                    Message({
                        message: error.response.data.message,
                        duration: 1500,
                        forbidClick: true
                    });
            }
            return Promise.reject(error.response);
        }
    }
)