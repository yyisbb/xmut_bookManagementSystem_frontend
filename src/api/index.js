import axios, {AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import {setToken, setUserInfo} from "../redux/global/globalSlice";
import {store} from "../redux";
import message from "../utils/messageUtil";

const config = {
    // 默认地址请求地址，可在 .env 开头文件中修改
    baseURL: '/api',
    // 设置超时时间（10s）
    timeout: 30000,
    // 跨域时候允许携带凭证
    withCredentials: true
};

class RequestHttp {
    service: AxiosInstance;

    constructor(config: AxiosRequestConfig) {
        // 实例化axios
        this.service = axios.create(config);

        /**
         * @description 请求拦截器
         * 客户端发送请求 -> [请求拦截器] -> 服务器
         * token校验(JWT) : 接受服务器返回的token,存储到redux/本地储存当中
         */
        this.service.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                // 判断token
                const token = store.getState().globalSlice.token
                return {...config, headers: {...config.headers, "X-token": token}};
            },
            (error: AxiosError) => {
                return Promise.reject(error);
            }
        );

        /**
         * @description 响应拦截器
         *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
         */
        this.service.interceptors.response.use(
            (response: AxiosResponse) => {
                const {data} = response;
                // 登录失效（code == 20001|| 20002）
                if (data.code === 20001 || data.code === 20002) {
                    // 设置token为空
                    store.dispatch(setToken(''));
                    store.dispatch(setUserInfo({}))

                    // 展示错误信息到页面 alert

                    // 跳转回登录页
                    message.error(data.message)
                    window.location.href = "/login";
                    return Promise.reject(data.message);
                }

                // 权限不足
                if (data.code === 20003 ) {
                    // 展示错误信息到页面 alert
                    message.error(data.message)
                    window.location.href = "/";
                    return Promise.reject(data.message);
                }

                // 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
                if (data.code && data.code !== 10000) {
                    // 展示错误信息到页面 alert
                    return Promise.reject(data.message)
                }
                // 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
                return data;
            },
            async (error: AxiosError) => {
                const {response} = error;
                // 请求超时单独判断，请求超时没有 response
                // 超时断网
                if (error.message.indexOf("timeout") !== -1) {
                    // 根据响应的错误提示
                    store.dispatch(setToken(''));
                    store.dispatch(setUserInfo({}))
                    message.error('无网络或请求失败,请检查后端是否已部署')
                }
                // 根据响应的错误状态码，做不同的处理 response.status 传进去
                // 写一个方法传进去

                if (response.status === 500) {
                    message.error('服务端异常,,请检查后端接口是否正常工作')
                }

                // 展示错误信息到页面 alert

                // 跳转回登录页

                // window.location.href = "/login";

                // 服务器结果都没有返回(可能服务器错误可能客户端断网) 断网处理:可以跳转到断网页面
                if (!window.navigator.onLine) window.location.hash = "/500";
                return Promise.reject(error);
            }
        );
    }

    // * 常用请求方法封装
    get(url: string, params, _object = {
        headers: {"Content-Type": "application/json"}
    }): Promise {
        return this.service.get(url, {params, ..._object});
    }

    post(url: string, params, _object = {
        headers: {"Content-Type": "application/json"}
    }): Promise {
        return this.service.post(url, params, _object);
    }

    postFile(url: string, params, _object={
        headers:{'Content-Type': 'multipart/form-data;charset=UTF-8'}
    }): Promise {
        return this.service.post(url, params, _object);
    }
}

export const http = new RequestHttp(config);
