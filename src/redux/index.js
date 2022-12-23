import {configureStore} from '@reduxjs/toolkit';
import storage from "redux-persist/lib/storage";
import {combineReducers} from 'redux'
import {persistReducer, persistStore} from 'redux-persist'
import thunk from 'redux-thunk'
// eslint-disable-next-line import/no-named-as-default
import globalSlice from './global/globalSlice'

// 缓存数据配置
const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['modalInfo', 'userInfoSlice', 'SimpleData']
}

const reducers = combineReducers({
    globalSlice,
})

const persistedReducer = persistReducer(persistConfig, reducers)


export const store = configureStore({
    reducer: persistedReducer,
    devTools: true, // 开启redux插件
    middleware: [thunk]
})

export const persist = persistStore(store) // 数据持久化存储
