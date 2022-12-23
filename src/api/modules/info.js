import {http} from '../index'

/**
 * @name 借阅模块
 */
// 借阅图书
export const getPlatformInfo = () => http.get('/getPlatformInfo');
