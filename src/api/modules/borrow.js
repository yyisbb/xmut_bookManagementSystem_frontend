import {http} from '../index'

/**
 * @name 借阅模块
 */
// 借阅图书
export const borrowBook = (bookNo) => http.post('/borrowBook', {bookNo});
// 归还图书
export const backBorrowBook = (bookNo) => http.post('/backBook', {bookNo});

// 借阅列表
export const getBorrowList = () => http.get('/getBorrowList',{});
