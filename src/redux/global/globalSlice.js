import {createSlice} from '@reduxjs/toolkit'

export const globalSlice = createSlice({
    name: 'globalSlice',
    initialState: {
        token: '',
        userInfo:{},
        noticeList:[]
    },
    reducers: {
        setToken: (state, action) => {
            // Redux Toolkit 允许我们在 reducers 写 "可变" 逻辑。它
            // 并不是真正地改变状态值，因为它使用了 Immer 库
            // 可以检测到“草稿状态“ 的变化并且基于这些变化生产全新的
            // 不可变的状态
            state.token = action.payload
        },
        setUserInfo:(state, action)=>{
            state.userInfo = action.payload
        },
        setNoticeList:(state, action)=>{
            state.noticeList = action.payload
        }
    }
})
// 每个 case reducer 函数会生成对应的 Action creators
export const {setToken, setUserInfo,setNoticeList} = globalSlice.actions

// 内置了thunk插件，可以直接处理异步请求
export const asyncIncrement = (payload) => (dispatch) => {
    setTimeout(() => {
        dispatch(setToken(payload));
    }, 2000);
};

export default globalSlice.reducer
