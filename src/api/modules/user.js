import {http} from '../index'

/**
 * @name 用户模块
 */
// * 用户所有信息接口
export const getAllUser = () => http.get('/getAllUser');
// 获取当前用户信息
export const getInfo = () => http.get('/getUserInfo');

// 删除用户接口
export const deleteUser = (ids) => http.post('/deleteUsers', {ids});
// 添加学生
export const addUser = (user) => http.post('/addUser', user);
// 重置密码
export const resetPassword = (id) => http.post('/resetPassword', {id});

// 修改密码
export const updatePassword = (newPassword) => http.post('/updatePassword', {newPassword});

// 禁用开启账户
export const disableUser = (id) => http.post('/disableUser', {id});
